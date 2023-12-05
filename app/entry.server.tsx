/**
 * By default, Remix will handle generating the HTTP Response for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.server
 */

import {PassThrough} from "node:stream";

import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import {renderToPipeableStream} from 'react-dom/server';
import createEmotionCache from './src/createEmotionCache';
import theme from './src/theme';
import CssBaseline from '@mui/material/CssBaseline';
import {ThemeProvider} from '@mui/material/styles';
import {CacheProvider} from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';
import type {AppLoadContext, EntryContext} from "@remix-run/node";
import {createReadableStreamFromReadable} from "@remix-run/node";
import {RemixServer} from "@remix-run/react";
import isbot from "isbot";

const ABORT_DELAY = 5_000;

export default function handleRequest(
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    remixContext: EntryContext,
) {
    const cache = createEmotionCache();
    const {extractCriticalToChunks} = createEmotionServer(cache);

    function MuiRemixServer() {
        return (
            <CacheProvider value={cache}>
                <ThemeProvider theme={theme}>
                    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                    <CssBaseline/>
                    <RemixServer context={remixContext} url={request.url}/>
                </ThemeProvider>
            </CacheProvider>
        );
    }

    const html = ReactDOMServer.renderToString(<MuiRemixServer/>);

    // Grab the CSS from emotion
    const {styles} = extractCriticalToChunks(html);

    let stylesHTML = '';

    styles.forEach(({key, ids, css}) => {
        const emotionKey = `${key} ${ids.join(' ')}`;
        const newStyleTag = `<style data-emotion="${emotionKey}">${css}</style>`;
        stylesHTML = `${stylesHTML}${newStyleTag}`;
    });

    // Add the Emotion style tags after the insertion point meta tag
    const markup = html.replace(
        /<meta(\s)*name="emotion-insertion-point"(\s)*content="emotion-insertion-point"(\s)*\/>/,
        `<meta name="emotion-insertion-point" content="emotion-insertion-point"/>${stylesHTML}`,
    );

    responseHeaders.set('Content-Type', 'text/html');

    return new Response(`<!DOCTYPE html>${markup}`, {
        status: responseStatusCode,
        headers: responseHeaders,
    });

    // return isbot(request.headers.get("user-agent"))
    //     ? handleBotRequest(
    //         request,
    //         responseStatusCode,
    //         responseHeaders,
    //         remixContext
    //     )
    //     : handleBrowserRequest(
    //         request,
    //         responseStatusCode,
    //         responseHeaders,
    //         remixContext
    //     );
}

// function handleBotRequest(
//     request: Request,
//     responseStatusCode: number,
//     responseHeaders: Headers,
//     remixContext: EntryContext
// ) {
//     return new Promise((resolve, reject) => {
//         let shellRendered = false;
//         const {pipe, abort} = renderToPipeableStream(
//             <RemixServer
//                 context={remixContext}
//                 url={request.url}
//                 abortDelay={ABORT_DELAY}
//             />,
//             {
//                 onAllReady() {
//                     shellRendered = true;
//                     const body = new PassThrough();
//                     const stream = createReadableStreamFromReadable(body);
//
//                     responseHeaders.set("Content-Type", "text/html");
//
//                     resolve(
//                         new Response(stream, {
//                             headers: responseHeaders,
//                             status: responseStatusCode,
//                         })
//                     );
//
//                     pipe(body);
//                 },
//                 onShellError(error: unknown) {
//                     reject(error);
//                 },
//                 onError(error: unknown) {
//                     responseStatusCode = 500;
//                     // Log streaming rendering errors from inside the shell.  Don't log
//                     // errors encountered during initial shell rendering since they'll
//                     // reject and get logged in handleDocumentRequest.
//                     if (shellRendered) {
//                         console.error(error);
//                     }
//                 },
//             }
//         );
//
//         setTimeout(abort, ABORT_DELAY);
//     });
// }

// function handleBrowserRequest(
//     request: Request,
//     responseStatusCode: number,
//     responseHeaders: Headers,
//     remixContext: EntryContext
// ) {
//     return new Promise((resolve, reject) => {
//         let shellRendered = false;
//         const {pipe, abort} = renderToPipeableStream(
//             <RemixServer
//                 context={remixContext}
//                 url={request.url}
//                 abortDelay={ABORT_DELAY}
//             />,
//             {
//                 onShellReady() {
//                     shellRendered = true;
//                     const body = new PassThrough();
//                     const stream = createReadableStreamFromReadable(body);
//
//                     responseHeaders.set("Content-Type", "text/html");
//
//                     resolve(
//                         new Response(stream, {
//                             headers: responseHeaders,
//                             status: responseStatusCode,
//                         })
//                     );
//
//                     pipe(body);
//                 },
//                 onShellError(error: unknown) {
//                     reject(error);
//                 },
//                 onError(error: unknown) {
//                     responseStatusCode = 500;
//                     // Log streaming rendering errors from inside the shell.  Don't log
//                     // errors encountered during initial shell rendering since they'll
//                     // reject and get logged in handleDocumentRequest.
//                     if (shellRendered) {
//                         console.error(error);
//                     }
//                 },
//             }
//         );
//
//         setTimeout(abort, ABORT_DELAY);
//     });
// }
