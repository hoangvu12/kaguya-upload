const defaultRuntimeCaching = require("./cache");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const withPWA = require("next-pwa");
const { i18n } = require("./next-i18next.config");

module.exports = withPWA({
  pwa: {
    dest: "public",
    buildExcludes: [
      /middleware-manifest\.json$/,
      /_middleware\.js$/,
      /_middleware\.js\.map$/,
      /middleware-runtime\.js$/,
      /middleware-runtime\.js\.map$/,
    ],
    disable: process.env.NODE_ENV === "development",
    runtimeCaching: defaultRuntimeCaching,
  },
  webpack: (config, { isServer }) => {
    config.plugins.push(
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "node_modules/libass-wasm/dist/js",
            to: `${isServer ? "../" : ""}static`,
          },
        ],
      })
    );

    return config;
  },
  i18n,
  experimental: {
    nextScriptWorkers: true,
    outputStandalone: true,
  },
});
