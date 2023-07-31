import { DataWithExtra } from "@/types";
import { Media } from "@/types/anilist";
import { sendMessage } from "@/utils/events";
import { getMediaId } from "@/utils/mediaId";
import { UseQueryOptions, useQuery } from "react-query";
import { toast } from "react-toastify";

type MangaIdProps = {
  sourceId: string;
  anilist: Media;
};

type MangaIdData = {
  mangaId: string;
  extraData?: Record<string, string>;
};

const defaultValue: MangaIdData = { mangaId: null, extraData: {} };

const toastId = "use-chapters";

const useMangaId = (
  anilist: Media,
  sourceId: string,
  options?: Omit<
    UseQueryOptions<MangaIdData, Error, MangaIdData, any>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery(
    ["manga-id", anilist.id, sourceId],
    async () => {
      console.log("[web page] fetching manga id");

      const savedAnimeId = getMediaId(anilist.id, sourceId);

      if (savedAnimeId?.mediaId) {
        return {
          mangaId: savedAnimeId.mediaId,
          extraData: savedAnimeId.extra,
        };
      }

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

      return { mangaId: mangaId, extraData };
    },
    {
      onError: (err) => {
        toast.error(err.message);
        toast.dismiss(toastId);
      },
      enabled: !!sourceId,
      ...options,
    }
  );
};

export default useMangaId;
