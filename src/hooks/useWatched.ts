import { getMedia } from "@/services/anilist";
import { Media } from "@/types/anilist";
import { WatchedEpisode } from "@/types/core";
import { getWatchedEpisodes } from "@/utils/episode";
import { isMobile } from "react-device-detect";
import { useQuery } from "react-query";

export interface WatchedEpisodesWithMedia extends WatchedEpisode {
  media: Media;
}

const useWatched = () => {
  return useQuery<WatchedEpisodesWithMedia[]>("watched", async () => {
    const watchedEpisodes = getWatchedEpisodes(isMobile ? 10 : 20);

    if (!watchedEpisodes?.length) return [];

    const mediaIds = watchedEpisodes.map(
      (watchedEpisode) => watchedEpisode.mediaId
    );

    const anilistMedia = await getMedia({
      id_in: mediaIds,
    });

    return watchedEpisodes.map((watched) => {
      const media = anilistMedia.find((media) => media.id === watched.mediaId);

      return {
        ...watched,
        media,
      };
    });
  });
};

export default useWatched;
