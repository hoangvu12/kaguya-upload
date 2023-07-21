import { getWatchedEpisode } from "@/utils/episode";
import { useQuery } from "react-query";

const useWatchedEpisode = (mediaId: number, sourceId: string) => {
  return useQuery(
    ["watched-episode", mediaId],
    () => {
      return getWatchedEpisode(mediaId, sourceId);
    },
    { enabled: !!sourceId }
  );
};

export default useWatchedEpisode;
