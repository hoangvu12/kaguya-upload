export enum SubtitleFormat {
  VTT = "vtt",
  ASS = "ass",
  SRT = "srt",
}

export enum VideoFormat {
  CONTAINER = "container",
  HLS = "hls",
  DASH = "dash",
}

export interface Translation {
  locale: string;
  description: string;
  title: string;
}

export interface Chapter {
  number: string;
  id: string;
  title?: string;
  extra?: Record<string, string>;
  translations?: Translation[];
  section?: string;
}

export interface Episode {
  number: string;
  id: string;
  title?: string;
  isFiller?: boolean;
  description?: string;
  thumbnail?: string;
  extra?: Record<string, string>;
  section?: string;
  translations?: Translation[];
}

export interface WatchedEpisode {
  episode: Episode;
  time: number;
  sourceId: string;
  mediaId: number;
}

export interface ReadChapter {
  chapter: Chapter;
  sourceId: string;
  mediaId: number;
}

export interface FileUrl {
  url: string;
  headers?: Record<string, string>;
}

export interface SearchResult {
  id: string;
  title: string;
  description?: string;
  thumbnail: string;
  extra?: Record<string, string>;
}

export interface Subtitle {
  language: string;
  file: FileUrl;
  format: SubtitleFormat;
}

export interface Video {
  quality?: string;
  format?: VideoFormat;
  file: FileUrl;
}

export interface VideoContainer {
  videos: Video[];
  subtitles?: Subtitle[];
}

export interface VideoServer {
  name: string;
  embed: string;
  extraData?: Record<string, string>;
}

export interface Source {
  name: string;
  url: string;
  id: string;
  isNSFW: boolean;
  languages: string[];
  logo: string;
}
