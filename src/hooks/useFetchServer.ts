import config from "@/config";
import { AnimeServer, Episode } from "@/types";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/dist/client/router";
import { useQuery } from "react-query";
import { toast } from "react-toastify";

interface ReturnSuccessType {
  success: true;
  servers: AnimeServer[];
}

interface ReturnFailType {
  success: false;
  error: string;
  errorMessage: string;
}

export const fetchServer = async (episode: Episode, locale: string) => {
  const hasViLocale = episode?.source?.locales?.includes("vi");

  const nodeServerUrl = (() => {
    if (hasViLocale || locale === "vi") {
      return config.nodeServer.vn;
    }

    return config.nodeServer.global;
  })();

  const { data } = await axios.get<ReturnSuccessType>(
    `${nodeServerUrl}/servers`,
    {
      params: {
        episode_id: episode.sourceEpisodeId,
        source_media_id: episode.sourceMediaId,
        source_id: episode.sourceId,
      },
    }
  );

  return data;
};

export const getQueryKey = (episode: Episode) =>
  `server-${episode.sourceId}-${episode.sourceEpisodeId}`;

export const useFetchServer = (currentEpisode: Episode) => {
  const { locale } = useRouter();

  return useQuery<ReturnSuccessType, AxiosError<ReturnFailType>>(
    getQueryKey(currentEpisode),
    () => fetchServer(currentEpisode, locale),
    {
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );
};
