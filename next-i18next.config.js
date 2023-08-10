const HttpBackend = require("i18next-http-backend/cjs");
const ChainedBackend = require("i18next-chained-backend").default;
const LocalStorageBackend = require("i18next-localstorage-backend").default;

const isDev = process.env.NODE_ENV === "development";

const locales = require("./src/locales.json");

/** @type {import("next-i18next").UserConfig} */
module.exports = {
  backend: {
    backendOptions: [
      {
        expirationTime: isDev ? 60 : 7 * 24 * 60 * 60 * 1000,
      },
      {
        loadPath: "/locales/{{ns}}/{{lng}}.json",
      },
    ], //  7 days
    backends:
      typeof window !== "undefined" ? [LocalStorageBackend, HttpBackend] : [],
  },
  i18n: {
    locales,
    defaultLocale: "en",
    reloadOnPrerender: isDev,
    load: "currentOnly",
  },
  serializeConfig: false,
  use: typeof window !== "undefined" ? [ChainedBackend] : [],
  localeStructure: "{{ns}}/{{lng}}",
  ns: [
    "404_page",
    "anime_details",
    "anime_home",
    "anime_watch",
    "character_details",
    "common",
    "_error_page",
    "file_uploading",
    "footer",
    "header",
    "manga_details",
    "manga_home",
    "manga_read",
    "pwa_install_prompt",
    "trace",
    "voice_actor_details",
  ],
};
