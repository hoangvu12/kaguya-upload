import { Chapter } from "@/types/core";
import { markChapterAsRead } from "@/utils/chapter";
import { useMutation } from "react-query";

const useSaveReadData = () => {
  return useMutation<
    void,
    unknown,
    {
      chapter: Chapter;
      mediaId: number;
      sourceId: string;
    }
  >(async (data) => {
    return markChapterAsRead(data);
  });
};

export default useSaveReadData;
