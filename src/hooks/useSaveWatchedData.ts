import { Episode } from "@/types/core";
import { markEpisodeAsWatched } from "@/utils/episode";
import { useMutation } from "react-query";

const useSaveWatchedData = () => {
  return useMutation<
    void,
    unknown,
    {
      episode: Episode;
      time: number;
      sourceId: string;
      mediaId: number;
    }
  >(async (data) => {
    return markEpisodeAsWatched(data);
  });
};

export default useSaveWatchedData;
