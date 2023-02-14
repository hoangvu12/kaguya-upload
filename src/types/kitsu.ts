export type Maybe<T> = T | null;

/** The connection type for Episode. */
export interface EpisodeConnection {
  /** A list of edges.*/
  edges: Maybe<EpisodeEdge[]>;
  /** A list of nodes.*/
  nodes: Maybe<Episode[]>;
  /** Information to aid in pagination.*/
  pageInfo: PageInfo;
  /** The total amount of nodes.*/
  totalCount: number;
}

/** An edge in a connection. */
export interface EpisodeEdge {
  /** A cursor for use in pagination.*/
  cursor: string;
  /** The item at the end of the edge.*/
  node: Maybe<Episode>;
}

/** An Episode of a Media */
export interface Episode {
  createdAt: undefined;
  /** A brief summary or description of the unit*/
  description: undefined;
  id: string;
  /** The length of the episode in seconds*/
  length: Maybe<number>;
  /** The sequence number of this unit*/
  number: number;
  /** When this episode aired*/
  releasedAt: Maybe<undefined>;
  /** A thumbnail image for the unit*/
  thumbnail: Maybe<Image>;
  /** The titles for this unit in various locales*/
  titles: TitlesList;
  updatedAt: undefined;
}

export interface TitlesList {
  /** A list of additional, alternative, abbreviated, or unofficial titles*/
  alternatives: Maybe<string[]>;
  /** The official or de facto international title*/
  canonical: string;
  /** The locale code that identifies which title is used as the canonical title*/
  canonicalLocale: Maybe<string>;
  /** The list of localized titles keyed by locale*/
  localized: Maybe<Record<string, string>>;
  /** The original title of the media in the original language*/
  original: Maybe<string>;
  /** The locale code that identifies which title is used as the original title*/
  originalLocale: Maybe<string>;
  /** The title that best matches the user's preferred settings*/
  preferred: string;
  /** The original title, romanized into latin script*/
  romanized: Maybe<string>;
  /** The locale code that identifies which title is used as the romanized title*/
  romanizedLocale: Maybe<string>;
  /** The title translated into the user's locale*/
  translated: Maybe<string>;
  /** The locale code that identifies which title is used as the translated title*/
  translatedLocale: Maybe<string>;
}

export interface Image {
  /** A blurhash-encoded version of this image*/
  blurhash: Maybe<string>;
  /** The original image*/
  original: ImageView;
  /** The various generated views of this image*/
  views: ImageView[];
}

export interface ImageView {
  /** The height of the image*/
  height: Maybe<number>;
  /** The name of this view of the image*/
  name: string;
  /** The URL of this view of the image*/
  url: string;
  /** The width of the image*/
  width: Maybe<number>;
}

/** Information about pagination in a connection. */
export interface PageInfo {
  /** When paginating forwards, the cursor to continue.*/
  endCursor: Maybe<string>;
  /** When paginating forwards, are there more items?*/
  hasNextPage: boolean;
  /** When paginating backwards, are there more items?*/
  hasPreviousPage: boolean;
  /** When paginating backwards, the cursor to continue.*/
  startCursor: Maybe<string>;
}
