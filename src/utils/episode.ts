import { Episode, WatchedEpisode } from "@/types/core";

const ANIME_APP_NAMESPACE = "kaguya";

export function getWatchedEpisodes(limit?: number): WatchedEpisode[] {
  try {
    const data = localStorage.getItem(ANIME_APP_NAMESPACE);

    if (!data) return [];

    const parsedData = JSON.parse(data);

    if (!parsedData?.watchedEpisodes) return [];

    if (limit) {
      return parsedData.watchedEpisodes.slice(0, limit);
    }

    return parsedData.watchedEpisodes;
  } catch (err) {
    console.error("Failed to get watched episodes", err);

    return [];
  }
}

export function markEpisodeAsWatched({
  episode,
  time,
  sourceId,
  mediaId,
}: {
  episode: Episode;
  time: number;
  sourceId: string;
  mediaId: number;
}) {
  const watchedEpisodes = getWatchedEpisodes();

  const watchedEpisode = watchedEpisodes?.find(
    (watchedEpisode) =>
      watchedEpisode.mediaId === mediaId && watchedEpisode.sourceId === sourceId
  );

  if (watchedEpisode) {
    watchedEpisode.time = time;
    watchedEpisode.episode = episode;
  } else {
    watchedEpisodes.push({ episode, time, sourceId, mediaId });
  }

  saveWatchedEpisodes(watchedEpisodes);
}

export function saveWatchedEpisodes(watchedEpisodes: WatchedEpisode[]) {
  let existData = localStorage.getItem(ANIME_APP_NAMESPACE);

  if (!existData) {
    localStorage.setItem(
      ANIME_APP_NAMESPACE,
      JSON.stringify({ watchedEpisodes })
    );

    return;
  }

  try {
    const parsedData = JSON.parse(existData);

    parsedData.watchedEpisodes = watchedEpisodes;

    localStorage.setItem(ANIME_APP_NAMESPACE, JSON.stringify(parsedData));
  } catch (err) {
    console.error("save watched episodes", err);
  }
}

export function getWatchedEpisode(
  mediaId: number,
  sourceId: string
): WatchedEpisode {
  const watchedEpisodes = getWatchedEpisodes();

  return watchedEpisodes.find(
    (watchedEpisode) =>
      watchedEpisode.mediaId === mediaId && watchedEpisode.sourceId === sourceId
  );
}
