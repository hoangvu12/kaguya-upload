import {
  chaptersAtom,
  currentChapterIndexAtom,
  imagesAtom,
  setChapterAtom,
} from "@/contexts/ReadContext";
import {
  activeImageIndexAtom,
  readPanelStateAtom,
} from "@/contexts/ReadPanelContext";
import { useReadSettings } from "@/contexts/ReadSettingsContext";
import { useAtomValue, useSetAtom } from "jotai";
import React, { useEffect, useMemo } from "react";
import ReadImage from "./ReadImage";

const VerticalContainer: React.FC = () => {
  const chapters = useAtomValue(chaptersAtom);
  const currentChapterIndex = useAtomValue(currentChapterIndexAtom);
  const setChapter = useAtomValue(setChapterAtom);
  const images = useAtomValue(imagesAtom);

  const activeImageIndex = useAtomValue(activeImageIndexAtom);
  const setState = useSetAtom(readPanelStateAtom);

  const { direction } = useReadSettings();

  const handleImageVisible = (index: number) => () => {
    setState((prev) => ({ ...prev, activeImageIndex: index }));
  };

  const handleChangeChapter = (index: number) => () => {
    setChapter(chapters[index]);
  };

  const nextChapter = useMemo(() => {
    return chapters?.[currentChapterIndex + 1];
  }, [currentChapterIndex, chapters]);

  useEffect(() => {
    // Don't need tp scroll to image if it's the first image
    if (activeImageIndex < 1) {
      return;
    }

    const currentImageElement: HTMLImageElement = document.querySelector(
      `[data-index="${activeImageIndex}"]`
    );

    if (!currentImageElement) return;

    // https://stackoverflow.com/questions/63197942/scrollintoview-not-working-properly-with-lazy-image-load
    currentImageElement.closest("div")?.scrollIntoView();

    setTimeout(() => {
      currentImageElement.closest("div")?.scrollIntoView();
    }, 600);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [direction]);

  return (
    <div className="w-full h-full">
      {images.map((image, index) => (
        <div className="image-container mx-auto" key={index}>
          <ReadImage
            onVisible={handleImageVisible(index)}
            className="mx-auto"
            image={image}
            data-index={index}
          />
        </div>
      ))}

      {currentChapterIndex < chapters.length - 1 && (
        <div className="w-full h-60 p-8">
          <button
            onClick={handleChangeChapter(currentChapterIndex + 1)}
            className="w-full h-full border-2 border-dashed border-gray-600 text-gray-600 hover:border-white hover:text-white transition duration-300 flex items-center justify-center"
          >
            <p
              title={`Next chapter - ${nextChapter.number}`}
              className="text-center text-2xl"
            >
              {nextChapter.number}
            </p>
          </button>
        </div>
      )}
    </div>
  );
};

export default React.memo(VerticalContainer);
