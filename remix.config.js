/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
    ignoredRouteFiles: ["**/.*"],
    // appDirectory: "app",
    // assetsBuildDirectory: "public/build",
    // publicPath: "/build/",
    // serverBuildPath: "build/index.js",

    // TODO: when mui has esm support, remove this (default is esm)
    // check it https://github.com/mui/material-ui/issues/30671
    serverModuleFormat: 'cjs',
    browserNodeBuiltinsPolyfill: {
        modules: {
            url: true,
            tls: true,
            punycode: true,
            util: true,
            http: true,
            https: true,
            stream: true,
            zlib: true,
            crypto: true,
            querystring: true,
            assert: true,
            buffer: true,
            path: true,
            net: true,
            fs: true,
            events: true,
        },
    },
};
