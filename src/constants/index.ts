import dayjs from "@/lib/dayjs";

const START_YEAR = 1940;
const CURRENT_YEAR = dayjs().year();

export const WEBSITE_URL = "https://kaguya.app";
export const DISCORD_URL = "https://discord.gg/382BEFfER6";
export const FACEBOOK_URL = "https://www.facebook.com/kaguyaa.live";

export const DISCORD_REG_URL = "https://discord.gg/62RkwWkvkP";

export const MAIN_WEBSITE_DOMAIN = process.env.NEXT_PUBLIC_WEB_DOMAIN;

export const REVALIDATE_TIME = 86_400; // 24 hours
export const SKIP_TIME = 90; // 1m30s

export const supportedUploadVideoFormats = [
  "ogm",
  "wmv",
  "mpg",
  "webm",
  "ogv",
  "mov",
  "asx",
  "mpeg",
  "mp4",
  "m4v",
  "avi",
];

export const supportedUploadSubtitleFormats = ["srt", "vtt", "ass"];
export const supportedUploadFontFormats = [
  "woff",
  "woff2",
  "ttf",
  "jfproj",
  "etx",
  "pfa",
  "fnt",
  "fot",
  "sfd",
  "vlw",
  "pfb",
  "vfb",
  "otf",
  "odttf",
  "gxf",
  "pf2",
  "bf",
  "ttc",
  "chr",
  "bdf",
  "fon",
  "gf",
  "pmt",
  "amfm",
  "mf",
  "pfm",
  "compositefont",
  "gdr",
  "abf",
  "vnf",
  "pcf",
  "sfp",
  "mxf",
  "dfont",
  "ufo",
  "pfr",
  "tfm",
  "glif",
  "xfn",
  "afm",
  "tte",
  "xft",
  "acfm",
  "eot",
  "ffil",
  "pk",
  "suit",
  "nftr",
  "euf",
  "txf",
  "cha",
  "lwfn",
  "t65",
  "mcf",
  "ytf",
  "f3f",
  "fea",
  "sft",
  "pft",
];

export const supportedUploadImageFormats = ["jpg", "jpeg", "png"];

export const SEASON_YEARS = new Array(CURRENT_YEAR + 1 - START_YEAR)
  .fill(null)
  .map((_, index) => START_YEAR + index)
  .sort((a, b) => b - a);
