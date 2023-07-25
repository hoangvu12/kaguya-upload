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

      const { data: animeId, extraData } = await sendMessage<
        AnimeIdProps,
        DataWithExtra<string>
      >("get-anime-id", { sourceId, anilist });

      if (!animeId) {
        toast.error("No anime link was found, please try again.");

        return defaultValue;
      }

      console.log("[web page] fetching episodes");

      const episodes = await sendMessage<EpisodeProps, Episode[]>(
        "get-episodes",
        { animeId: animeId, sourceId, extraData }
      );

      return sortMediaUnit(episodes) || defaultValue;
    },
    {
      onError: (err) => toast.error(err.message),
      ...options,
    }
  );
};

export default useEpisodes;
