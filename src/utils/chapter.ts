import { Chapter, ReadChapter } from "@/types/core";

const ANIME_APP_NAMESPACE = "kaguya_new";

export function getReadChapters(limit?: number): ReadChapter[] {
  try {
    const data = localStorage.getItem(ANIME_APP_NAMESPACE);

    if (!data) return [];

    const parsedData = JSON.parse(data);

    if (!parsedData?.readChapters) return [];

    const readChapters: ReadChapter[] = parsedData.readChapters.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    if (limit) {
      return readChapters.slice(0, limit);
    }

    return readChapters;
  } catch (err) {
    console.error("Failed to get watched episodes", err);

    return [];
  }
}

export function markChapterAsRead({
  chapter,
  mediaId,
  sourceId,
}: {
  chapter: Chapter;
  sourceId: string;
  mediaId: number;
}) {
  const readChapters = getReadChapters();

  const readChapter = readChapters?.find(
    (readChapter) => readChapter.mediaId === mediaId
  );

  if (readChapter) {
    readChapter.chapter = chapter;
    readChapter.updatedAt = new Date();
  } else {
    readChapters.push({
      chapter,
      mediaId,
      createdAt: new Date(),
      updatedAt: new Date(),
      sourceId,
    });
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

export function getReadChapter(mediaId: number): ReadChapter {
  const readChapters = getReadChapters();

  return readChapters.find((readChapter) => readChapter.mediaId === mediaId);
}
