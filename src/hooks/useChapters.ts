import { DataWithExtra } from "@/types";
import { Media } from "@/types/anilist";
import { Chapter } from "@/types/core";
import { sortMediaUnit } from "@/utils/data";
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

const toastId = "use-episodes";

const useChapters = (
  anilist: Media,
  sourceId: string,
  options?: Omit<
    UseQueryOptions<Chapter[], unknown, Chapter[]>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<Chapter[], Error, Chapter[], any>(
    ["chapters", anilist.id, sourceId],
    async () => {
      console.log("[web page] fetching anime id");

      toast.loading("Fetching Manga ID...", { toastId });

      const { data: mangaId, extraData } = await sendMessage<
        MangaIdProps,
        DataWithExtra<string>
      >("get-manga-id", { sourceId, anilist });

      if (!mangaId) {
        toast.error(
          "No manga id was found, please try again or try another source."
        );

        toast.dismiss(toastId);

        return defaultValue;
      }

      toast.update(toastId, {
        render: "Fetching chapters...",
        isLoading: true,
      });

      console.log("[web page] fetching episodes");

      const chapters = await sendMessage<ChapterProps, Chapter[]>(
        "get-chapters",
        { mangaId: mangaId, sourceId, extraData }
      );

      if (!chapters?.length) {
        toast.error(
          "No chapters were found, please try again or try another source."
        );
      }

      toast.dismiss(toastId);

      return sortMediaUnit(chapters) || defaultValue;
    },
    {
      onError: (err) => {
        toast.error(err.message);
        toast.dismiss(toastId);
      },
      ...options,
    }
  );
};

export default useChapters;
