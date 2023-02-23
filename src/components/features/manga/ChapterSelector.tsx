import HeadlessSwiper, {
  SwiperSlide,
} from "@/components/shared/HeadlessSwiper";
import Link from "@/components/shared/Link";
import Popup from "@/components/shared/Popup";
import Select from "@/components/shared/Select";
import { SwiperInstance } from "@/components/shared/Swiper";
import { Chapter, Read } from "@/types";
import {
  chunk,
  groupBy,
  parseNumberFromString,
  sortObjectByValue,
} from "@/utils";
import classNames from "classnames";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { isMobileOnly } from "react-device-detect";
import { SwiperOptions } from "swiper";

export interface ChapterSelectorProps {
  chapters: Chapter[];
  mediaId: number;
  readData?: Read;
  chapterChunk?: number;
}

const swiperOptions: SwiperOptions = {
  spaceBetween: 10,
  mousewheel: true,
  keyboard: true,
  breakpoints: {
    1536: {
      slidesPerView: 8.5,
      slidesPerGroup: 8.5,
    },
    1280: {
      slidesPerView: 7.5,
      slidesPerGroup: 7.5,
    },
    1024: {
      slidesPerView: 6.5,
      slidesPerGroup: 6.5,
    },
    768: {
      slidesPerView: 5.5,
      slidesPerGroup: 5.5,
    },
    640: {
      slidesPerView: 4.5,
      slidesPerGroup: 4.5,
    },
    0: {
      slidesPerView: 3.5,
      slidesPerGroup: 3.5,
    },
  },
};

const sourcesToOptions = (sources: string[]) =>
  sources.map((source) => ({ value: source, label: source }));

const ChapterSelector: React.FC<ChapterSelectorProps> = ({
  chapters,
  mediaId,
  readData,
  chapterChunk = isMobileOnly ? 5 : 10,
}) => {
  const savedActiveChunkIndex = useRef<number>(0);
  const [swiper, setSwiper] = useState<SwiperInstance>();

  const fastSources = useMemo(() => {
    const fastChapters = chapters.filter((chapter) => chapter.source.isFast);

    const sources = groupBy(fastChapters, (chapter) => chapter.source.name);

    const sortedSources = sortObjectByValue(
      sources,
      (a, b) => b.length - a.length
    );

    return sortedSources;
  }, [chapters]);

  const verifiedSources = useMemo(() => {
    const verifiedChapters = chapters.filter(
      (chapter) => chapter.source.isCustomSource && !chapter.source.isFast
    );

    const sources = groupBy(verifiedChapters, (chapter) => chapter.source.name);

    const sortedSources = sortObjectByValue(
      sources,
      (a, b) => b.length - a.length
    );

    return sortedSources;
  }, [chapters]);

  const nonVerifiedSources = useMemo(() => {
    const nonVerifiedChapters = chapters.filter(
      (chapter) => !chapter.source.isCustomSource && !chapter.source.isFast
    );

    const sources = groupBy(
      nonVerifiedChapters,
      (chapter) => chapter.source.name
    );

    const sortedSources = sortObjectByValue(
      sources,
      (a, b) => b.length - a.length
    );

    return sortedSources;
  }, [chapters]);

  const sources = useMemo(() => {
    return {
      ...fastSources,
      ...verifiedSources,
      ...nonVerifiedSources,
    };
  }, [fastSources, verifiedSources, nonVerifiedSources]);

  const [activeSource, setActiveSource] = useState(() => {
    return readData?.chapter?.source?.name || Object.keys(sources)[0];
  });

  const sourceChapters = useMemo(
    () => chapters.filter((chapter) => chapter.source.name === activeSource),
    [activeSource, chapters]
  );

  const chunks = useMemo(
    () => chunk(sourceChapters, chapterChunk),
    [chapterChunk, sourceChapters]
  );

  const [activeChunk, setActiveChunk] = useState(() => {
    return (
      chunks.find((chunk) =>
        chunk.some(
          (chapter) =>
            chapter.chapterNumber === readData?.chapter?.chapterNumber
        )
      ) || chunks[0]
    );
  });

  const activeChunkIndex = useMemo(() => {
    return chunks.findIndex((chunk) => chunk === activeChunk);
  }, [activeChunk, chunks]);

  const chunkOptions = useMemo(() => {
    const options = chunks.map((chunk, i) => {
      const firstChapterName = parseNumberFromString(
        chunk[0].name,
        chunk[0].name
      );
      const lastChapterName = parseNumberFromString(
        chunk[chunk.length - 1].name,
        chunk[chunk.length - 1].name
      );

      const title =
        chunk.length === 1
          ? `${firstChapterName}`
          : `${firstChapterName} - ${lastChapterName}`;

      return {
        value: chunk,
        label: title,
      };
    });

    return options;
  }, [chunks]);

  const readSourceChapter = useMemo(() => {
    const readChapter = readData?.chapter;

    if (!readChapter) return null;

    const readEpisodeNumber = readChapter.chapterNumber;

    const readEpisodeInActiveChunk = activeChunk.find(
      (chunk) => chunk.chapterNumber === readEpisodeNumber
    );

    if (!readEpisodeInActiveChunk) return readChapter;

    return readEpisodeInActiveChunk;
  }, [activeChunk, readData?.chapter]);

  const onChunkChange = ({ value }) => {
    setActiveChunk(value);

    const index = chunks.findIndex((chunk) => chunk === value);

    savedActiveChunkIndex.current = index;
  };

  useEffect(() => {
    const sourceKeys = Object.keys(sources);

    if (!sourceKeys?.length) return;

    if (!sourceKeys.includes(activeSource)) {
      setActiveSource(sourceKeys[0]);
    }
  }, [activeSource, sources]);

  useEffect(() => {
    setActiveChunk(
      chunks.find((chunk) =>
        chunk.some(
          (chapter) =>
            chapter.chapterNumber === readData?.chapter?.chapterNumber
        )
      ) || chunks[0]
    );
  }, [chunks, readData?.chapter?.chapterNumber]);

  useEffect(() => {
    if (!swiper) return;

    swiper.slideTo(activeChunkIndex, 300);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChunkIndex]);

  useEffect(() => {
    if (!swiper) return;

    swiper.activeIndex =
      savedActiveChunkIndex.current === -1 ? 0 : savedActiveChunkIndex.current;
    swiper.update();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chunkOptions]);

  const onEachChapter = (chapter: Chapter) => {
    const isRead = chapter.chapterNumber <= readData?.chapter?.chapterNumber;

    return (
      <Link
        href={`/manga/read/${mediaId}/${chapter.sourceId}/${chapter.sourceChapterId}`}
        key={chapter.sourceChapterId}
      >
        <a className="relative block p-2 bg-background-800 hover:bg-white/20 duration-300 transition">
          <p className="line-clamp-1 text-sm font-semibold">{chapter.name}</p>

          {isRead && (
            <div className="absolute left-0 top-0 w-0.5 h-full bg-primary-500"></div>
          )}
        </a>
      </Link>
    );
  };

  const handleSwiperInit = useCallback((swiper: SwiperInstance) => {
    setSwiper(swiper);
  }, []);

  return (
    <React.Fragment>
      <div className="flex flex-col w-full mx-auto mb-8 gap-8">
        <div className="self-end flex flex-col md:flex-row md:items-center gap-2">
          <Popup
            reference={
              <p className="text-right font-semibold underline">Wrong title?</p>
            }
            placement="top"
            className="bg-background-700"
            showArrow
          >
            <p className="max-w-[60vw]">
              You can either change the source or report the issue in our{" "}
              Discord server.
            </p>
          </Popup>

          <div className="flex items-center gap-2">
            <label htmlFor="source-selector" className="font-medium">
              Sources:{" "}
            </label>

            <Select
              id="source-selector"
              options={[
                {
                  label: "Quality",
                  options: sourcesToOptions(Object.keys(fastSources)),
                },
                {
                  label: "Verified",
                  options: sourcesToOptions(Object.keys(verifiedSources)),
                },
                {
                  label: "Normal",
                  options: sourcesToOptions(Object.keys(nonVerifiedSources)),
                },
              ]}
              onChange={({ value }) => {
                setActiveSource(value);
              }}
              defaultValue={{ value: activeSource, label: activeSource }}
              isClearable={false}
              isSearchable={false}
            />
          </div>

          {/* <Select
            value={activeChunkOption}
            options={chunkOptions}
            className="ml-auto"
            isClearable={false}
            defaultValue={activeChunkOption}
            onChange={({ value }) => {
              setActiveChunk(value);
            }}
          /> */}
        </div>

        <div className="flex overflow-hidden">
          <HeadlessSwiper
            onInit={handleSwiperInit}
            defaultValue={activeChunkIndex}
            className="w-full grow"
            options={swiperOptions}
          >
            {chunkOptions.map((option) => (
              <SwiperSlide key={option.label}>
                <button
                  type="button"
                  className={classNames(
                    "w-full text-center rounded-md px-3 py-2 line-clamp-1",
                    option.value === activeChunk
                      ? "bg-primary-600"
                      : "bg-background-600"
                  )}
                  onClick={() => onChunkChange(option)}
                >
                  {option.label}
                </button>
              </SwiperSlide>
            ))}
          </HeadlessSwiper>
        </div>
      </div>

      <div className="space-y-2 overflow-hidden">
        {readSourceChapter && (
          <div className="flex items-center gap-4">
            <p className="shrink-0">Continue reading: </p>

            <div className="w-full">{onEachChapter(readSourceChapter)}</div>
          </div>
        )}

        {activeChunk.map(onEachChapter)}
      </div>
    </React.Fragment>
  );
};

export default ChapterSelector;
