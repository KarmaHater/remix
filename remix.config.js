import { createRoutesFromFolders } from "@remix-run/v1-route-convention";

/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ["**/.*"],

  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
  // serverBuildPath: "build/index.js",
  routes(defineRoutes) {
    return createRoutesFromFolders(defineRoutes);
  },

  // routes: (defineRoutes) =>
  //   defineRoutes((route) =>
  //     route("__tests/login", "__test-routes__/login.tsx")
  //   ),
};
