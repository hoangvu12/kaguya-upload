import { Media } from "@/types/anilist";
import { Episode } from "@/types/core";
import { parseNumberFromString } from "@/utils";
import { sortMediaUnit } from "@/utils/data";
import { sendMessage } from "@/utils/events";
import { getEpisodeInfo } from "@/utils/tmdb";
import { useRouter } from "next/router";
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
  const { locale } = useRouter();

  return useQuery(
    ["episodes", anilist.id, sourceId, animeId, locale],
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

      const tmdbEpisodes = await getEpisodeInfo(anilist, locale);

      if (!tmdbEpisodes?.length) {
        return composedEpisodes;
      }

      const episodesWithTranslations: Episode[] = composedEpisodes.map(
        (composedEpisode) => {
          const translation = tmdbEpisodes.find(
            (episode) =>
              episode.episodeNumber ===
              parseNumberFromString(composedEpisode.number, 9999)
          );

          if (!translation) return composedEpisode;

          return {
            ...composedEpisode,
            thumbnail: composedEpisode.thumbnail || translation?.image,
            title: composedEpisode.title || translation?.title,
            description:
              composedEpisode.description || translation?.description,
          };
        }
      );

      return episodesWithTranslations;
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
