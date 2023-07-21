import { Episode, VideoContainer, VideoServer } from "@/types/core";
import { sendMessage } from "@/utils/events";
import { UseQueryOptions, useQuery } from "react-query";
import { toast } from "react-toastify";

interface VideoContainerProps {
  videoServer: VideoServer;
  extraData: Record<string, string>;
  sourceId: string;
}

export const getQueryKey = (episode: Episode, sourceId: string) =>
  `source-${sourceId}-${episode.id}`;

export const useFetchSource = (
  currentEpisode: Episode,
  sourceId: string,
  server: VideoServer,
  options?: Omit<
    UseQueryOptions<VideoContainer, Error, VideoContainer, any>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<VideoContainer, Error>(
    [getQueryKey(currentEpisode, sourceId), server],
    async () => {
      // console.log(JSON.stringify({ currentEpisode, server }));

      const videoContainer = await sendMessage<
        VideoContainerProps,
        VideoContainer
      >("get-video-container", {
        videoServer: server,
        extraData: server.extraData,
        sourceId,
      });

      if (!videoContainer?.videos?.length)
        return {
          videos: [],
          subtitles: [],
        };

      // update rules to apply required headers
      const videoFileUrls = videoContainer.videos.map((video) => video.file);
      const subtitleFileUrls =
        videoContainer.subtitles?.map((subtitle) => subtitle.file) || [];

      const fileUrls = [...videoFileUrls, ...subtitleFileUrls].filter(
        (url) => url.headers
      );

      if (fileUrls?.length) {
        await sendMessage("update-rules", {
          fileUrls,
        });
      }

      return videoContainer;
    },
    {
      onError: (error) => {
        toast.error(error);
      },
      enabled: !!server?.name,

      ...options,
    }
  );
};
