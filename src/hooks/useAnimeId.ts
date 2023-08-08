import { DataWithExtra } from "@/types";
import { Media } from "@/types/anilist";
import { sendMessage } from "@/utils/events";
import { getMediaId, saveMapping } from "@/utils/mediaId";
import { UseQueryOptions, useQuery } from "react-query";
import { toast } from "react-toastify";

type AnimeIdProps = {
  sourceId: string;
  anilist: Media;
};

type AnimeIdData = {
  animeId: string;
  extraData?: Record<string, string>;
};

const defaultValue: AnimeIdData = { animeId: null, extraData: {} };

const toastId = "use-episodes";

const useAnimeId = (
  anilist: Media,
  sourceId: string,
  options?: Omit<
    UseQueryOptions<AnimeIdData, Error, AnimeIdData, any>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery(
    ["anime-id", anilist.id, sourceId],
    async () => {
      console.log("[web page] fetching anime id");

      const savedAnimeId = getMediaId(anilist.id, sourceId);

      if (savedAnimeId?.mediaId) {
        return {
          animeId: savedAnimeId.mediaId,
          extraData: savedAnimeId.extra,
        };
      }

      toast.loading("Fetching Anime ID...", { toastId });

      const { data: animeId, extraData } = await sendMessage<
        AnimeIdProps,
        DataWithExtra<string>
      >("get-anime-id", { sourceId, anilist });

      if (!animeId) {
        toast.error(
          "No anime id was found, please try again or try another source."
        );

        toast.dismiss(toastId);

        return defaultValue;
      }

      saveMapping(anilist.id, sourceId, animeId, extraData);

      return { animeId, extraData };
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

export default useAnimeId;
