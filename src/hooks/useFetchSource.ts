import config from "@/config";
import { Episode, Font, Subtitle, VideoSource } from "@/types";
import { createProxyUrl } from "@/utils";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/dist/client/router";
import { useQuery } from "react-query";
import { toast } from "react-toastify";

interface ReturnSuccessType {
  success: true;
  sources: VideoSource[];
  subtitles?: Subtitle[];
  fonts?: Font[];
  thumbnail?: string;
}

interface ReturnFailType {
  success: false;
  error: string;
  errorMessage: string;
}

export const fetchSource = async (episode: Episode, locale: string) => {
  const hasViLocale = episode?.source?.locales?.includes("vi");

  const nodeServerUrl = (() => {
    if (hasViLocale || locale === "vi") {
      return config.nodeServer.vn;
    }

    return config.nodeServer.global;
  })();

  const convertSources = (sources: VideoSource[]) =>
    sources.map((source) => {
      if (source.useProxy && !source.isEmbed) {
        source.file = createProxyUrl(
          source.file,
          source.proxy,
          source.usePublicProxy,
          source.useEdgeProxy,
          episode?.source?.locales?.includes("vi") ? "vi" : locale
        );
      }

      return source;
    });

  const { data } = await axios.get<ReturnSuccessType>(
    `${nodeServerUrl}/source`,
    {
      params: {
        episode_id: episode.sourceEpisodeId,
        source_media_id: episode.sourceMediaId,
        source_id: episode.sourceId,
      },
    }
  );
  data.sources = convertSources(data.sources);
  return data;
};

export const getQueryKey = (episode: Episode) =>
  `source-${episode.sourceId}-${episode.sourceEpisodeId}`;

export const useFetchSource = (currentEpisode: Episode) => {
  const { locale } = useRouter();

  return useQuery<ReturnSuccessType, AxiosError<ReturnFailType>>(
    getQueryKey(currentEpisode),
    () => fetchSource(currentEpisode, locale),
    {
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );
};
