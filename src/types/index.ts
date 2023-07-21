import { MediaTitle as ALMediaTitle } from "./anilist";

export interface MediaTitle extends Partial<ALMediaTitle> {
  [key: string]: string;
}

export type VideoSource = {
  file: string;
  label?: string;
};

export type DataWithExtra<T> = {
  data: T;
  extraData?: Record<string, string>;
};

export type CallbackSetter<T> = (handler: T) => void;

export type Noop = () => void;

export type MediaListStatus =
  | "CURRENT"
  | "PLANNING"
  | "COMPLETED"
  | "DROPPED"
  | "PAUSED"
  | "REPEATING";

export type SkipType = "ed" | "op" | "mixed-ed" | "mixed-op" | "recap";

export interface SkipTimeStamp {
  interval: {
    startTime: number;
    endTime: number;
  };
  skipType: SkipType;
  skipId: string;
  episodeLength: number;
}

export interface AnimeSongTheme {
  title: string;
}
export interface AnimeTheme {
  slug: string;
  song: AnimeSongTheme;
  name: string;
  type: string;
  episode: string;
  sources: VideoSource[];
  anilistId?: number;
}

export type DeviceSelectors = {
  isBrowser: boolean;
  isDesktop: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isSmartTV: boolean;
  isConsole: boolean;
  isWearable: boolean;
  isEmbedded: boolean;
  isMobileSafari: boolean;
  isChromium: boolean;
  isMobileOnly: boolean;
  isAndroid: boolean;
  isWinPhone: boolean;
  isIOS: boolean;
  isChrome: boolean;
  isFirefox: boolean;
  isSafari: boolean;
  isOpera: boolean;
  isIE: boolean;
  isEdge: boolean;
  isYandex: boolean;
  osVersion: string;
  osName: string;
  fullBrowserVersion: string;
  browserVersion: string;
  browserName: string;
  mobileVendor: string;
  mobileModel: string;
  engineName: string;
  engineVersion: string;
  getUA: string;
  deviceType: string;
  isIOS13: boolean;
  isIPad13: boolean;
  isIPhone13: boolean;
  isIPod13: boolean;
  isElectron: boolean;
  isEdgeChromium: boolean;
  isLegacyEdge: boolean;
  isWindows: boolean;
  isMacOs: boolean;
  isMIUI: boolean;
  isSamsungBrowser: boolean;
};
