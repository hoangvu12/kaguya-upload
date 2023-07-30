import { DataWithExtra } from "@/types";
import { Media } from "@/types/anilist";
import { Episode } from "@/types/core";
import { sortMediaUnit } from "@/utils/data";
import { sendMessage } from "@/utils/events";
import { UseQueryOptions, useQuery } from "react-query";
import { toast } from "react-toastify";

type AnimeIdProps = {
  sourceId: string;
  anilist: Media;
};

type EpisodeProps = {
  sourceId: string;
  animeId: string;
  extraData?: Record<string, string>;
};

const defaultValue: Episode[] = [];

const toastId = "use-episodes";

const useEpisodes = (
  anilist: Media,
  sourceId: string,
  options?: Omit<
    UseQueryOptions<Episode[], Error, Episode[], any>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery(
    ["episodes", anilist.id, sourceId],
    async () => {
      console.log("[web page] fetching anime id");

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

      console.log("[web page] fetching episodes");

      toast.update(toastId, {
        render: "Fetching episodes...",
        isLoading: true,
      });

      const episodes = await sendMessage<EpisodeProps, Episode[]>(
        "get-episodes",
        { animeId: animeId, sourceId, extraData }
      );

      if (!episodes?.length) {
        toast.error(
          "No episodes were found, please try again or try another source."
        );
      }

      toast.dismiss(toastId);

      const composedEpisodes = sortMediaUnit(episodes) || defaultValue;

      return composedEpisodes;
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

export default useEpisodes;
