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

export const fetchSource = async (
  episode: Episode,
  serverId: string,
  locale: string
) => {
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
        server_id: serverId,
      },
    }
  );
  data.sources = convertSources(data.sources);
  return data;
};

export const getQueryKey = (episode: Episode, serverId: string) =>
  `source-${episode.sourceId}-${episode.sourceEpisodeId}-${serverId}`;

export const useFetchSource = (currentEpisode: Episode, serverId: string) => {
  const { locale } = useRouter();

  return useQuery<ReturnSuccessType, AxiosError<ReturnFailType>>(
    getQueryKey(currentEpisode, serverId),
    () => fetchSource(currentEpisode, serverId, locale),
    {
      onError: (error) => {
        toast.error(error.message);
      },
      enabled: !!serverId,
    }
  );
};
