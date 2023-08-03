import {
  AiringScheduleArgs,
  CharacterArgs,
  MediaArgs,
  PageArgs,
  RecommendationArgs,
  StaffArgs,
  StudioArgs,
} from "@/types/anilist";
import { removeArrayOfObjectDup } from "@/utils";
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

  return response?.Page;
};

export const getMedia = async (args: MediaArgs & PageArgs, fields?: string) => {
  const response = await anilistFetcher<PageQueryResponse>(
    mediaQuery(fields),
    args
  );

  const mediaList = response?.Page?.media || [];

  return mediaList;
};

export const getMediaDetails = async (
  args: MediaArgs & PageArgs,
  fields?: string
) => {
  const response = await anilistFetcher<MediaDetailsQueryResponse>(
    mediaDetailsQuery(fields),
    args
  );

  const media = response?.Media;

  return media;
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
