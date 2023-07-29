import { getReadChapter } from "@/utils/chapter";
import { useQuery } from "react-query";

const useReadChapter = (mediaId: number) => {
  return useQuery(["read-episode", mediaId], () => {
    return getReadChapter(mediaId);
  });
};

export default useReadChapter;
