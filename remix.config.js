/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  // routes(defineRoutes) {
  //   return defineRoutes((route) => {
  //     route("/", "home/route.tsx", { index: true });
  //   });
  // },
  ignoredRouteFiles: ['**/.*'],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
  // serverBuildPath: "build/index.js",

  // TODO: when mui has esm support, remove this (default is esm)
  // check it https://github.com/mui/material-ui/issues/30671
  serverModuleFormat: 'cjs',
}
