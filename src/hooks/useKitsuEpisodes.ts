import { getEpisodes } from "@/services/kitsu";
import { useQuery } from "react-query";

const useKitsuEpisodes = (mediaId: number) => {
  return useQuery(["kitsu-episodes", mediaId], async () => {
    return getEpisodes(mediaId);
  });
};

export default useKitsuEpisodes;
