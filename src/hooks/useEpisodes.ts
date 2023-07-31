import { DataWithExtra } from "@/types";
import { Media } from "@/types/anilist";
import { Episode } from "@/types/core";
import { sortMediaUnit } from "@/utils/data";
import { sendMessage } from "@/utils/events";
import { UseQueryOptions, useQuery } from "react-query";
import { toast } from "react-toastify";

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
  {
    animeId,
    extraData,
  }: { animeId: string; extraData?: Record<string, string> } = {
    animeId: null,
  },
  options?: Omit<
    UseQueryOptions<Episode[], Error, Episode[], any>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery(
    ["episodes", anilist.id, sourceId, animeId],
    async () => {
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
      enabled: !!animeId,
      ...options,
    }
  );
};

export default useEpisodes;
