import supabaseClient from "@/lib/supabase";
import { AnimeSourceConnection } from "@/types";
import { sortMediaUnit } from "@/utils/data";
import axios from "axios";
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

type EpisodeInfo = {
  id: string;
  title: string;
  description: string;
  number: number;
  image: string;
  isFiller: boolean;
};

const fetchEpisodeInfo = async (mediaId: number) => {
  const { data } = await axios.get<EpisodeInfo[]>(
    `https://api.consumet.org/meta/anilist/episodes/${mediaId}?fetchFiller=true`
  );

  return data;
};

const useEpisodes = (mediaId: number, includeEpisodeInfo?: boolean) => {
  return useQuery(["episodes", mediaId], async () => {
    const kaguyaEpisodesPromise = supabaseClient
      .from<AnimeSourceConnection>("kaguya_anime_source")
      .select(query)
      .eq("mediaId", mediaId);

    let episodeInfoPromise: Promise<EpisodeInfo[]> = Promise.resolve([]);

    if (includeEpisodeInfo) {
      episodeInfoPromise = fetchEpisodeInfo(mediaId);
    }

    const [episodePromise, infoEpisodesPromise] = await Promise.allSettled([
      kaguyaEpisodesPromise,
      episodeInfoPromise,
    ]);

    if (episodePromise.status === "rejected") {
      throw episodePromise.reason;
    }

    let infoEpisodes: EpisodeInfo[] = [];

    if (infoEpisodesPromise.status === "fulfilled") {
      infoEpisodes = infoEpisodesPromise.value;
    }

    const { data, error } = episodePromise.value;

    if (error) throw error;

    const episodes = data?.flatMap((connection) => connection.episodes);

    const sortedEpisodes = sortMediaUnit(
      episodes.filter((episode) => episode.published)
    );

    if (includeEpisodeInfo) {
      if (infoEpisodes?.length) {
        episodes.forEach((episode) => {
          const infoEpisode = infoEpisodes.find(
            (infoEpisode) => infoEpisode.number === episode.episodeNumber
          );

          if (!infoEpisode) return;

          episode.description = {};
          episode.title = {};

          episode.description.en = infoEpisode.description;
          episode.thumbnail = infoEpisode.image;
          episode.title.en = infoEpisode.title;
          episode.isFiller = infoEpisode.isFiller;
        });
      }
    }

    return sortedEpisodes;
  });
};

export default useEpisodes;
