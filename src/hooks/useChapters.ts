import { DataWithExtra } from "@/types";
import { Media } from "@/types/anilist";
import { Chapter } from "@/types/core";
import { sendMessage } from "@/utils/events";
import { UseQueryOptions, useQuery } from "react-query";
import { toast } from "react-toastify";

type MangaIdProps = {
  sourceId: string;
  anilist: Media;
};

type ChapterProps = {
  sourceId: string;
  mangaId: string;
  extraData?: Record<string, string>;
};

const defaultValue: Chapter[] = [];

const useChapters = (
  anilist: Media,
  sourceId: string,
  options?: Omit<
    UseQueryOptions<Chapter[], unknown, Chapter[]>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery(
    ["chapters", anilist.id, sourceId],
    async () => {
      console.log("[web page] fetching anime id");

      const { data: mangaId, extraData } = await sendMessage<
        MangaIdProps,
        DataWithExtra<string>
      >("get-manga-id", { sourceId, anilist });

      if (!mangaId) {
        toast.error("No manga id was found, please try again.");

        return defaultValue;
      }

      console.log("[web page] fetching episodes");

      const chapters = await sendMessage<ChapterProps, Chapter[]>(
        "get-chapters",
        { mangaId: mangaId, sourceId, extraData }
      );

      return chapters || defaultValue;
    },
    options
  );
};

export default useChapters;
