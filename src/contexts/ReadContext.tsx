import { Chapter, ImageSource } from "@/types";
import { Media } from "@/types/anilist";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { selectAtom } from "jotai/utils";
import { useEffect } from "react";

interface State {
  manga: Media;
  chapters: Chapter[];
  currentChapter: Chapter;
  currentChapterIndex: number;
  setChapter: (chapter: Chapter) => void;
  sourceId: string;
  images: ImageSource[];
}

export const readStateAtom = atom(null as State);

export const mangaAtom = selectAtom(readStateAtom, (data) => data?.manga);
export const imagesAtom = selectAtom(
  readStateAtom,
  (data) => data?.images || []
);
export const chaptersAtom = selectAtom(
  readStateAtom,
  (data) => data?.chapters || []
);
export const currentChapterAtom = selectAtom(
  readStateAtom,
  (data) => data?.currentChapter
);
export const currentChapterIndexAtom = selectAtom(
  readStateAtom,
  (data) => data?.currentChapterIndex
);
export const setChapterAtom = selectAtom(
  readStateAtom,
  (data) => data?.setChapter
);
export const sourceIdAtom = selectAtom(readStateAtom, (data) => data?.sourceId);

export const ReadContextProvider = ({ value }) => {
  const setReadState = useSetAtom(readStateAtom);

  useEffect(() => {
    setReadState(value);
  }, [setReadState, value]);

  return null;
};

export const useReadInfo = () => {
  return useAtomValue(readStateAtom);
};
