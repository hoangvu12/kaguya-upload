import { Episode, VideoServer } from "@/types/core";
import { sendMessage } from "@/utils/events";
import { AxiosError } from "axios";
import { UseQueryOptions, useQuery } from "react-query";
import { toast } from "react-toastify";

interface VideoServersProps {
  episodeId: string;
  sourceId: string;
  extraData: Record<string, string>;
}

export const getQueryKey = (episode: Episode, sourceId: string) =>
  `server-${sourceId}-${episode.id}`;

const useFetchServers = (
  currentEpisode: Episode,
  sourceId: string,
  options?: Omit<
    UseQueryOptions<VideoServer[], Error, VideoServer[], string>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<VideoServer[], Error>(
    getQueryKey(currentEpisode, sourceId),
    async () => {
      const servers = await sendMessage<VideoServersProps, VideoServer[]>(
        "get-video-servers",
        {
          episodeId: currentEpisode.id,
          sourceId,
          extraData: currentEpisode.extra,
        }
      );

      return servers;
    },
    {
      onError: (error) => {
        toast.error(error);
      },

      ...options,
    }
  );
};

export default useFetchServers;
