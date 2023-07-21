import { Chapter, ReadChapter } from "@/types/core";

const ANIME_APP_NAMESPACE = "kaguya";

export function getReadChapters(limit?: number): ReadChapter[] {
  try {
    const data = localStorage.getItem(ANIME_APP_NAMESPACE);

    if (!data) return [];

    const parsedData = JSON.parse(data);

    if (!parsedData?.readChapters) return [];

    if (limit) {
      return parsedData.readChapters.slice(0, limit);
    }

    return parsedData.readChapters;
  } catch (err) {
    console.error("Failed to get watched episodes", err);

    return [];
  }
}

export function markChapterAsRead({
  chapter,
  sourceId,
  mediaId,
}: {
  chapter: Chapter;
  sourceId: string;
  mediaId: number;
}) {
  const readChapters = getReadChapters();

  const readChapter = readChapters?.find(
    (readChapter) =>
      readChapter.mediaId === mediaId && readChapter.sourceId === sourceId
  );

  if (readChapter) {
    readChapter.chapter = chapter;
  } else {
    readChapters.push({ chapter, sourceId, mediaId });
  }

  saveReadChapters(readChapters);
}

export function saveReadChapters(readChapters: ReadChapter[]) {
  let existData = localStorage.getItem(ANIME_APP_NAMESPACE);

  if (!existData) {
    localStorage.setItem(ANIME_APP_NAMESPACE, JSON.stringify({ readChapters }));

    return;
  }

  try {
    const parsedData = JSON.parse(existData);

    parsedData.readChapters = readChapters;

    localStorage.setItem(ANIME_APP_NAMESPACE, JSON.stringify(parsedData));
  } catch (err) {
    console.error("save read chapters", err);
  }
}

export function getReadChapter(mediaId: number, sourceId: string): ReadChapter {
  const readChapters = getReadChapters();

  return readChapters.find(
    (readChapter) =>
      readChapter.mediaId === mediaId && readChapter.sourceId === sourceId
  );
}
