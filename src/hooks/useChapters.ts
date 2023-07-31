import { Media } from "@/types/anilist";
import { Chapter } from "@/types/core";
import { sortMediaUnit } from "@/utils/data";
import { sendMessage } from "@/utils/events";
import { UseQueryOptions, useQuery } from "react-query";
import { toast } from "react-toastify";

type ChapterProps = {
  sourceId: string;
  mangaId: string;
  extraData?: Record<string, string>;
};

const defaultValue: Chapter[] = [];

const toastId = "use-chapters";

const useChapters = (
  anilist: Media,
  sourceId: string,
  {
    mangaId,
    extraData,
  }: { mangaId: string; extraData?: Record<string, string> } = {
    mangaId: null,
  },
  options?: Omit<
    UseQueryOptions<Chapter[], unknown, Chapter[]>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<Chapter[], Error, Chapter[], any>(
    ["chapters", anilist.id, sourceId, mangaId],
    async () => {
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
