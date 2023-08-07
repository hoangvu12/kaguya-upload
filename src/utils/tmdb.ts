import { Media, MediaFormat } from "@/types/anilist";
import { Translation } from "@/types/core";
import axios from "axios";
import { getMapping } from "./mapping";
import { removeArrayOfObjectDup } from ".";

export declare module TMDBSearch {
  export interface KnownFor {
    backdrop_path: string;
    first_air_date: string;
    genre_ids: number[];
    id: number;
    media_type: string;
    name: string;
    origin_country: string[];
    original_language: string;
    original_name: string;
    overview: string;
    poster_path: string;
    vote_average: number;
    vote_count: number;
    adult?: boolean;
    original_title: string;
    release_date: string;
    title: string;
    video?: boolean;
  }

  export interface Result {
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: number;
    media_type: string;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
    gender?: number;
    known_for: KnownFor[];
    known_for_department: string;
    name: string;
    profile_path: string;
    first_air_date: string;
    origin_country: string[];
    original_name: string;
  }

  export interface Response {
    page: number;
    results: Result[];
    total_pages: number;
    total_results: number;
  }
}

export declare module TMDBTranlations {
  export interface Data {
    name: string;
    overview: string;
    homepage: string;
    tagline: string;
    title: string;
  }

  export interface Translation {
    iso_3166_1: string;
    iso_639_1: string;
    name: string;
    english_name: string;
    data: Data;
  }

  export interface Response {
    id: number;
    translations: Translation[];
  }
}

type Season = {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
};

const TMDB_KEY = "e8d53ad78d99a4722c3f0f0f6a5c9014";

const client = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key: TMDB_KEY,
  },
});

export const getTMDBId = async (media: Media) => {
  const mapping = await getMapping("anilist_id", media.id);

  if ("themoviedb_id" in mapping) {
    return mapping.themoviedb_id;
  }

  if ("thetvdb_id" in mapping) {
    const { data } = await client.get<any>(`/find/${mapping.thetvdb_id}`, {
      params: {
        external_source: "tvdb_id",
      },
    });

    if (data?.tv_results?.[0]?.id) return data?.tv_results?.[0]?.id;
  }

  const type = media.format === MediaFormat.Movie ? "movie" : "tv";

  const searchResult = await search(
    media.title.english || media.title.userPreferred,
    type
  );

  return searchResult?.id;
};

export const getSeasons = async (tmdbId: number) => {
  const { data } = await client.get<any>(`/tv/${tmdbId}`);

  if (!data?.seasons) return null;

  const filteredSeasons = data.seasons.filter(
    (season) => season?.season_number > 0
  );

  return filteredSeasons as Season[];
};

export const getSeason = async (
  seasons: Season[],
  date: { year: number; month: number; day: number },
  totalEpisodes?: number
) => {
  try {
    const filterSeason = (seasons: Season[], key: keyof typeof date) => {
      return seasons.filter((season) => {
        // 2021-01-11
        let [seasonYearString, seasonMonthString, seasonDayString] =
          season.air_date.split("-");

        const seasonYear = Number(seasonYearString);
        const seasonMonth = Number(seasonMonthString);
        const seasonDay = Number(seasonDayString);

        if (key === "day") {
          return seasonDay === date.day;
        }

        if (key === "month") {
          return seasonMonth === date.month;
        }

        if (key === "year") {
          return seasonYear === date.year;
        }
      });
    };

    const yearSeasons = filterSeason(seasons, "year");

    if (yearSeasons.length === 0) return null;

    if (yearSeasons.length === 1) return yearSeasons[0];

    const monthSeasons = filterSeason(yearSeasons, "month");

    if (monthSeasons.length === 0) return null;

    if (monthSeasons.length === 1) return monthSeasons[0];

    const daySeasons = filterSeason(monthSeasons, "day");

    if (daySeasons.length === 0) return null;

    if (daySeasons.length === 1) return daySeasons[0];

    if (totalEpisodes) {
      const season = daySeasons.find(
        (season) => season.episode_count === totalEpisodes
      );

      if (season) return season;
    }

    return daySeasons[0];
  } catch (err) {
    console.error("getSeason tmdb", err);

    return null;
  }
};

export const getSeasonTranslations = async (tmdbId: number, season: Season) => {
  const { data } = await client.get<any>(
    `/tv/${tmdbId}/season/${season.season_number}/translations`
  );

  if (!data?.translations?.length) return [];

  return data.translations.map((translation) => ({ ...translation, season }));
};

export const search = async (keyword: string, type: "movie" | "tv") => {
  const { data } = await client.get<TMDBSearch.Response>(`/search/${type}`, {
    params: { language: "en-US", query: keyword, page: 1, include_adult: true },
  });

  if (!data?.results?.length) return null;

  return data.results[0];
};

export const getMediaTranslations = async (
  media: Media
): Promise<Translation[]> => {
  const type = media.format === MediaFormat.Movie ? "movie" : "tv";

  const id = await getTMDBId(media);

  const { data } = await client.get<TMDBTranlations.Response>(
    `/${type}/${id}/translations`
  );

  const overallMediaTranslation = removeArrayOfObjectDup(
    data.translations.map((trans) => ({
      locale: trans.iso_639_1,
      description: trans.data.overview,
      title: trans.data.title || trans.data.name || null,
    })),
    "locale"
  );

  if (type === "movie") return overallMediaTranslation;

  const seasons = await getSeasons(id);
  const season = await getSeason(seasons, media.startDate, media.episodes);

  if (!season?.season_number) return overallMediaTranslation;

  const seasonTranslations = await getSeasonTranslations(id, season);

  const translations = overallMediaTranslation.map((translation) => {
    const seasonTranslation = seasonTranslations.find(
      (seasonTranslation) => seasonTranslation.iso_639_1 === translation.locale
    );

    const shouldAddSeasonSuffix = seasons?.length > 1;

    const title = translation.title
      ? `${translation.title} ${
          shouldAddSeasonSuffix ? `(${season?.season_number})` : ""
        }`
      : null;

    return {
      locale: translation.locale,
      description:
        seasonTranslation?.data?.overview || translation.description || null,
      title: seasonTranslation?.data?.title || title,
    };
  });

  return translations || [];
};
