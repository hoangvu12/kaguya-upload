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
      mediaId: number;
      sourceId: string;
    }
  >(async (data) => {
    return markEpisodeAsWatched(data);
  });
};

export default useSaveWatchedData;
