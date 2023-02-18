import { useReadInfo } from "@/contexts/ReadContext";
import { useReadPanel } from "@/contexts/ReadPanelContext";
import { useReadSettings } from "@/contexts/ReadSettingsContext";
import React, { useEffect, useMemo } from "react";
import ReadImage from "./ReadImage";
import dynamic from "next/dynamic";

const Banner = dynamic(() => import("@/components/features/ads/Banner"), {
  ssr: false,
});

const VerticalContainer: React.FC = () => {
  const {
    currentChapterIndex,
    chapters,
    setChapter,
    images,
    currentChapter,
    manga,
  } = useReadInfo();
  const { state, setState } = useReadPanel();
  const { direction } = useReadSettings();

  const sourceChapters = useMemo(
    () =>
      chapters.filter(
        (chapter) => chapter.sourceId === currentChapter.sourceId
      ),
    [chapters, currentChapter]
  );

  const handleImageVisible = (index: number) => () => {
    setState((prev) => ({ ...prev, activeImageIndex: index }));
  };

  const handleChangeChapter = (index: number) => () => {
    setChapter(sourceChapters[index]);
  };

  const nextChapter = useMemo(() => {
    return sourceChapters?.[currentChapterIndex + 1];
  }, [currentChapterIndex, sourceChapters]);

  useEffect(() => {
    const currentImageElement: HTMLImageElement = document.querySelector(
      `[data-index="${state.activeImageIndex}"]`
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
      {!manga.isAdult && (
        <Banner desktop="970x250" mobile="300x250" type="atf" />
      )}

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

      {!manga.isAdult && (
        <Banner desktop="300x250" mobile="320x100" type="btf" />
      )}

      {currentChapterIndex < sourceChapters.length - 1 && (
        <div className="w-full h-60 p-8">
          <button
            onClick={handleChangeChapter(currentChapterIndex + 1)}
            className="w-full h-full border-2 border-dashed border-gray-600 text-gray-600 hover:border-white hover:text-white transition duration-300 flex items-center justify-center"
          >
            <p
              title={`Next chapter - ${nextChapter.name}`}
              className="text-center text-2xl"
            >
              {nextChapter.name}
            </p>
          </button>
        </div>
      )}
    </div>
  );
};

export default React.memo(VerticalContainer);
