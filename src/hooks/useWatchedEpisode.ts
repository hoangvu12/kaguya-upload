import { getWatchedEpisode } from "@/utils/episode";
import { useQuery } from "react-query";

const useWatchedEpisode = (mediaId: number) => {
  return useQuery(["watched-episode", mediaId], () => {
    return getWatchedEpisode(mediaId);
  });
};

export default useWatchedEpisode;
