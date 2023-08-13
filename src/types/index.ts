import { Attachment, FileInfo } from "@/services/upload";
import { MediaTitle as ALMediaTitle } from "./anilist";

export interface MediaTitle extends Partial<ALMediaTitle> {
  [key: string]: string;
}

export type MediaDescription = Record<string, string>;

export type SourceConnection = {
  sourceId: string;
  sourceMediaId: string;
  mediaId: number;
  updated_at?: any;
  created_at?: any;
};

export interface AnimeSourceConnection extends SourceConnection {
  episodes: SupabaseEpisode[];
}

export interface MangaSourceConnection extends SourceConnection {
  chapters: SupabaseChapter[];
}

export type Source = {
  id: string;
  name: string;
  languages: string[];
  userId?: string;
};

export type Video = {
  fonts: Attachment[];
  subtitles: Attachment[];
  video: FileInfo;
  episodeId: string;
  userId: string;
  hostingId: string;
};

export type Hosting = {
  id: string;
  name: string;
  supportedUrlFormats: string[];
};

export type SupabaseEpisode = {
  sourceConnectionId: string;
  sourceId: string;
  sourceEpisodeId: string;
  sourceMediaId: string;
  slug: string;
  thumbnail?: string;
  published?: boolean;
  section?: string;
  number: number;
  description?: string;
  title?: string;
  video: Video;
};

export type SupabaseChapter = {
  sourceConnectionId?: string;
  sourceId: string;
  sourceChapterId: string;
  sourceMediaId: string;
  source: Source;
  slug: string;
  published: boolean;
  number: number;
  title?: string;
  section?: string;
  images: {
    images: Attachment[];
  }[];
};

export type Subtitle = {
  file: string;
  lang: string;
  language: string;
};

export type Font = {
  file: string;
};

export type CallbackSetter<T> = (handler: T) => void;

export type Noop = () => void;

export interface UploadSubtitle {
  file: File;
  name: string;
  locale: string;
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
