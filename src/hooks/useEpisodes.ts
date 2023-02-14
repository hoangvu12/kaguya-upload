import supabaseClient from "@/lib/supabase";
import { getEpisodes } from "@/services/kitsu";
import { AnimeSourceConnection } from "@/types";
import { Episode } from "@/types/kitsu";
import { sortMediaUnit } from "@/utils/data";
import { useQuery } from "react-query";

const query = `
  *,
  episodes:kaguya_episodes(
      *,
      source:kaguya_sources(
          *
      )
  )
`;

const useEpisodes = (mediaId: number, useKitsu?: boolean) => {
  return useQuery(["episodes", mediaId], async () => {
    const kaguyaEpisodesPromise = supabaseClient
      .from<AnimeSourceConnection>("kaguya_anime_source")
      .select(query)
      .eq("mediaId", mediaId);

    let kitsuEpisodesPromise: Promise<Episode[]> = Promise.resolve([]);

    if (useKitsu) {
      kitsuEpisodesPromise = getEpisodes(mediaId);
    }

    const [{ data, error }, kitsuEpisodes] = await Promise.all([
      kaguyaEpisodesPromise,
      kitsuEpisodesPromise,
    ]);

    if (error) throw error;

    const episodes = data?.flatMap((connection) => connection.episodes);

    const sortedEpisodes = sortMediaUnit(
      episodes.filter((episode) => episode.published)
    );

    if (useKitsu) {
      if (kitsuEpisodes?.length) {
        episodes.forEach((episode) => {
          const kitsuEpisode = kitsuEpisodes.find(
            (kitsuEpisode) => kitsuEpisode.number === episode.episodeNumber
          );

          if (!kitsuEpisode) return;

          episode.description = kitsuEpisode.description;
          episode.thumbnail = kitsuEpisode.thumbnail?.original?.url;
          episode.title = kitsuEpisode.titles?.localized;
        });
      }
    }

    return sortedEpisodes;
  });
};

export default useEpisodes;
