import * as React from 'react'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from '@remix-run/react'
import { withEmotionCache } from '@emotion/react'
import { unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/material'
import theme from './src/theme'
import ClientStyleContext from './src/ClientStyleContext'
import Layout from './src/Layout'
import { json, LoaderFunctionArgs } from '@remix-run/node'
import { readConfig } from '~/config.server'

export function useRootLoaderData() {
  return useRouteLoaderData<typeof loader>('root')
}

export const loader = async ({
  request,
  params,
  context,
}: LoaderFunctionArgs) => {
  const config = await readConfig()
  return json({ dashboards: config.dashboards.map(db => db.name) })
}

interface DocumentProps {
  children: React.ReactNode
  title?: string
}

const Document = withEmotionCache(
  ({ children, title }: DocumentProps, emotionCache) => {
    const clientStyleData = React.useContext(ClientStyleContext)

    // Only executed on client
    useEnhancedEffect(() => {
      // re-link sheet container
      emotionCache.sheet.container = document.head
      // re-inject tags
      const tags = emotionCache.sheet.tags
      emotionCache.sheet.flush()
      tags.forEach(tag => {
        // eslint-disable-next-line no-underscore-dangle
        ;(emotionCache.sheet as any)._insertTag(tag)
      })
      // reset cache to reapply global styles
      clientStyleData.reset()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta name="theme-color" content={theme.palette.primary.main} />
          <title>{title}</title>
          <Meta />
          <Links />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin=""
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&display=swap"
          />
          <meta
            name="emotion-insertion-point"
            content="emotion-insertion-point"
          />
        </head>
        <body>
          {children}
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    )
  },
)

// https://remix.run/docs/en/main/route/component
// https://remix.run/docs/en/main/file-conventions/routes
export default function App() {
  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  )
}
