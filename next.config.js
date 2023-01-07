const withPWA = require("next-pwa");
const defaultRuntimeCaching = require("./cache");
const { i18n } = require("./next-i18next.config");

module.exports = withPWA({
  images: {
    domains: [
      "s4.anilist.co",
      "res.cloudinary.com",
      "lh3.googleusercontent.com",
      "platform-lookaside.fbsbx.com",
      "i.ibb.co",
      "thumb.tapecontent.net",
      "emojis.slackmojis.com",
      "pic-bstarstatic.akamaized.net",
      "cdn.discordapp.com",
    ],
    minimumCacheTTL: 604800, // a week,
    deviceSizes: [360, 412, 480, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
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
  i18n,
  experimental: {
    nextScriptWorkers: true,
  },
});
