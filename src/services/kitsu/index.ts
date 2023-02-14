import { Translation } from "@/types";
import {
  AiringSchedule,
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

import axios from "axios";
import { episodesQuery } from "./queries";
import { EpisodeConnection } from "@/types/kitsu";

const GRAPHQL_URL = "https://kitsu.io/api/graphql";

export const kitsuFetcher = async <T>(query: string, variables: any) => {
  type Response = {
    data: T;
  };

  const { data } = await axios.post<Response>(GRAPHQL_URL, {
    query,
    variables,
  });

  return data?.data;
};

export const getEpisodes = async (mediaId: number) => {
  const data = await kitsuFetcher<{
    lookupMapping: {
      episodes: EpisodeConnection;
    };
  }>(episodesQuery(), {
    externalId: mediaId.toString(),
    externalSite: "ANILIST_ANIME",
  });

  return data?.lookupMapping?.episodes?.nodes?.filter(Boolean);
};
