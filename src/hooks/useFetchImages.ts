import config from "@/config";
import { Chapter, ImageSource } from "@/types";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/dist/client/router";
import { useQuery, useQueryClient } from "react-query";

interface ReturnSuccessType {
  success: true;
  images: ImageSource[];
}

interface ReturnFailType {
  success: false;
  error: string;
  errorMessage: string;
}

const useFetchImages = (currentChapter: Chapter, nextChapter?: Chapter) => {
  const queryClient = useQueryClient();
  const { locale } = useRouter();

  const fetchImages = async (chapter: Chapter) => {
    const hasViLocale = chapter?.source?.locales?.includes("vi");

    const nodeServerUrl = (() => {
      if (hasViLocale || locale === "vi") {
        return config.nodeServer.vn;
      }

      return config.nodeServer.global;
    })();

    const { data } = await axios.get<ReturnSuccessType>(
      `${nodeServerUrl}/images`,
      {
        params: {
          source_media_id: chapter.sourceMediaId,
          chapter_id: chapter.sourceChapterId,
          source_id: chapter.sourceId,
        },
      }
    );
    return data;
  };

  const getQueryKey = (chapter: Chapter) =>
    `images-${chapter.sourceId}-${chapter.sourceChapterId}`;

  return useQuery<ReturnSuccessType, AxiosError<ReturnFailType>>(
    getQueryKey(currentChapter),
    () => fetchImages(currentChapter),
    {
      onSuccess: () => {
        if (!nextChapter?.sourceChapterId) return;

        queryClient.prefetchQuery(getQueryKey(nextChapter), () =>
          fetchImages(nextChapter)
        );
      },
    }
  );
};

export default useFetchImages;
