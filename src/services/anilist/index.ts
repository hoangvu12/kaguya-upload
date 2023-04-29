import locales from "@/locales.json";
import { Translation } from "@/types";
import {
  AiringScheduleArgs,
  CharacterArgs,
  MediaArgs,
  MediaType,
  PageArgs,
  RecommendationArgs,
  StaffArgs,
  StudioArgs,
} from "@/types/anilist";
import { removeArrayOfObjectDup } from "@/utils";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { getTranslations } from "../tmdb";
import {
  MediaDetailsQueryResponse,
  PageQueryResponse,
  StudioDetailsQueryResponse,
  airingSchedulesQuery,
  charactersDefaultFields,
  charactersQuery,
  mediaDefaultFields,
  mediaDetailsQuery,
  mediaQuery,
  recommendationsQuery,
  staffDefaultFields,
  staffQuery,
  studioDetailsQuery,
  studiosQuery,
} from "./queries";

import axios from "axios";

const GRAPHQL_URL = "https://graphql.anilist.co";

const LOCALES = locales.map(({ locale }) => locale);

export const anilistFetcher = async <T>(query: string, variables: any) => {
  type Response = {
    data: T;
  };

  const { data } = await axios.post<Response>(GRAPHQL_URL, {
    query,
    variables,
  });

  return data?.data;
};

export const getPageMedia = async (
  args: MediaArgs & PageArgs,
  fields?: string
) => {
  const response = await anilistFetcher<PageQueryResponse>(
    mediaQuery(fields),
    args
  );

  const mediaIdList = response?.Page?.media?.map((media) => media.id);

  const { data: mediaTranslations, error } = await supabaseClient
    .from<Translation>("kaguya_translations")
    .select("*")
    .in("mediaId", mediaIdList)
    .in("locale", LOCALES);

  if (error || !mediaTranslations?.length) return response?.Page;

  response?.Page?.media?.forEach((media) => {
    const translations = mediaTranslations.filter(
      (translation) => translation.mediaId === media.id
    );

    if (!translations?.length) return;

    media.translations = translations;
  });

  return response?.Page;
};

export const getMedia = async (
  args: MediaArgs & PageArgs,
  fields?: string,
  shouldFetchTranslations = true
) => {
  const response = await anilistFetcher<PageQueryResponse>(
    mediaQuery(fields),
    args
  );

  const mediaList = response?.Page?.media || [];

  if (!shouldFetchTranslations) return mediaList;

  const mediaIdList = mediaList.map((media) => media.id);

  const { data: mediaTranslations, error } = await supabaseClient
    .from<Translation>("kaguya_translations")
    .select("*")
    .in("mediaId", mediaIdList)
    .in("locale", LOCALES);

  if (error || !mediaTranslations?.length) return mediaList;

  return mediaList.map((media) => {
    const translations = mediaTranslations.filter(
      (trans) => trans.mediaId === media.id
    );

    return {
      ...media,
      translations,
    };
  });
};

export const getMediaDetails = async (
  args: MediaArgs & PageArgs,
  fields?: string
) => {
  const response = await anilistFetcher<MediaDetailsQueryResponse>(
    mediaDetailsQuery(fields),
    args
  );

  let translations: Translation[] = [];
  const media = response?.Media;

  const { data, error } = await supabaseClient
    .from<Translation>("kaguya_translations")
    .select("*")
    .eq("mediaId", media.id)
    .eq("mediaType", args?.type || MediaType.Anime)
    .in("locale", LOCALES);

  if (error) return media;

  if (data?.length) {
    translations = data;
  } else if (args?.type === MediaType.Manga) {
    translations = null;
  } else {
    translations = await getTranslations(media);
  }

  return {
    ...media,
    translations,
  };
};

export const getAiringSchedules = async (
  args: AiringScheduleArgs & PageArgs,
  fields?: string
) => {
  const response = await anilistFetcher<PageQueryResponse>(
    airingSchedulesQuery(fields),
    args
  );

  return response?.Page.airingSchedules;
};

export const getPageAiringSchedules = async (
  args: AiringScheduleArgs & PageArgs,
  fields?: string
) => {
  const response = await anilistFetcher<PageQueryResponse>(
    airingSchedulesQuery(fields),
    args
  );

  if (!response?.Page?.airingSchedules?.length) return response?.Page;

  response.Page.airingSchedules = removeArrayOfObjectDup(
    response?.Page?.airingSchedules.filter(
      (schedule) => !schedule.media.isAdult
    ),
    "mediaId"
  );

  return response?.Page;
};

export const getRecommendations = async (
  args: RecommendationArgs & PageArgs,
  fields?: string
) => {
  const response = await anilistFetcher<PageQueryResponse>(
    recommendationsQuery(fields),
    args
  );

  return response?.Page.recommendations;
};

export const getCharacters = async (
  args: PageArgs & CharacterArgs,
  fields?: string
) => {
  const response = await anilistFetcher<PageQueryResponse>(
    charactersQuery(fields),
    args
  );

  return response?.Page.characters;
};

export const getPageCharacters = async (
  args: PageArgs & CharacterArgs,
  fields?: string
) => {
  const response = await anilistFetcher<PageQueryResponse>(
    charactersQuery(fields),
    args
  );

  return response?.Page;
};

export const getCharacterDetails = async (
  args: PageArgs & CharacterArgs,
  fields?: string
) => {
  const defaultFields = `
    ${charactersDefaultFields}
    media {
      edges {
        node {
          ${mediaDefaultFields}
        }
        voiceActors {
          ${staffDefaultFields}
        }
      }
    }
  `;

  const response = await anilistFetcher<PageQueryResponse>(
    charactersQuery(fields || defaultFields),
    { ...args, perPage: 1 }
  );

  return response?.Page.characters[0];
};

export const getStaff = async (args: PageArgs & StaffArgs, fields?: string) => {
  const response = await anilistFetcher<PageQueryResponse>(
    staffQuery(fields),
    args
  );

  return response?.Page.staff;
};

export const getStaffDetails = async (
  args: PageArgs & StaffArgs,
  fields?: string
) => {
  const defaultFields = `
    ${staffDefaultFields}
    characters {
      nodes {
        ${charactersDefaultFields}
      }
    }
  `;

  const response = await anilistFetcher<PageQueryResponse>(
    staffQuery(fields || defaultFields),
    { ...args, perPage: 1 }
  );

  return response?.Page.staff[0];
};

export const getPageStaff = async (
  args: PageArgs & StaffArgs,
  fields?: string
) => {
  const response = await anilistFetcher<PageQueryResponse>(
    staffQuery(fields),
    args
  );

  return response?.Page;
};

export const getStudios = async (
  args: PageArgs & StudioArgs,
  fields?: string
) => {
  const response = await anilistFetcher<PageQueryResponse>(
    studiosQuery(fields),
    args
  );

  return response?.Page.studios;
};

export const getPageStudios = async (
  args: PageArgs & StudioArgs,
  fields?: string
) => {
  const response = await anilistFetcher<PageQueryResponse>(
    studiosQuery(fields),
    args
  );

  return response?.Page;
};

export const getStudioDetails = async (
  args: PageArgs & StudioArgs,
  fields?: string
) => {
  const response = await anilistFetcher<StudioDetailsQueryResponse>(
    studioDetailsQuery(fields),
    args
  );

  return response?.Studio;
};
