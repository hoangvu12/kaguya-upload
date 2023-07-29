import { Episode, WatchedEpisode } from "@/types/core";

const ANIME_APP_NAMESPACE = "kaguya_new";

export function getWatchedEpisodes(limit?: number): WatchedEpisode[] {
  try {
    const data = localStorage.getItem(ANIME_APP_NAMESPACE);

    if (!data) return [];

    const parsedData = JSON.parse(data);

    if (!parsedData?.watchedEpisodes) return [];

    const watchedEpisodes: WatchedEpisode[] = parsedData.watchedEpisodes.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    if (limit) {
      return watchedEpisodes.slice(0, limit);
    }

    return watchedEpisodes;
  } catch (err) {
    console.error("Failed to get watched episodes", err);

    return [];
  }
}

export function markEpisodeAsWatched({
  episode,
  time,
  mediaId,
  sourceId,
}: {
  episode: Episode;
  time: number;
  mediaId: number;
  sourceId: string;
}) {
  const watchedEpisodes = getWatchedEpisodes();

  const watchedEpisode = watchedEpisodes?.find(
    (watchedEpisode) => watchedEpisode.mediaId === mediaId
  );

  if (watchedEpisode) {
    watchedEpisode.time = time;
    watchedEpisode.episode = episode;
    watchedEpisode.updatedAt = new Date();
  } else {
    watchedEpisodes.push({
      episode,
      time,
      mediaId,
      createdAt: new Date(),
      updatedAt: new Date(),
      sourceId,
    });
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

export function getWatchedEpisode(mediaId: number): WatchedEpisode {
  const watchedEpisodes = getWatchedEpisodes();

  return watchedEpisodes.find(
    (watchedEpisode) => watchedEpisode.mediaId === mediaId
  );
}
