import { getReadChapter } from "@/utils/chapter";
import { useQuery } from "react-query";

const useReadChapter = (mediaId: number, sourceId: string) => {
  return useQuery(
    ["read-episode", mediaId],
    () => {
      return getReadChapter(mediaId, sourceId);
    },
    { enabled: !!sourceId }
  );
};

export default useReadChapter;
