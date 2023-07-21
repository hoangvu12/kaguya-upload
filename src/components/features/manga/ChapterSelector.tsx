import HeadlessSwiper, {
  SwiperInstance,
  SwiperSlide,
} from "@/components/shared/HeadlessSwiper";
import Link from "@/components/shared/Link";
import Select from "@/components/shared/Select";
import { Media } from "@/types/anilist";
import { Chapter, Episode, ReadChapter, WatchedEpisode } from "@/types/core";
import { chunk, groupBy, parseNumberFromString } from "@/utils";
import classNames from "classnames";
import { LinkProps } from "next/link";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { isMobileOnly } from "react-device-detect";
import { SwiperOptions } from "swiper";

interface ChapterSelectorProps {
  chapters: Episode[];
  sourceId: string;
  media: Media;
  activeChapter?: Chapter;
  readChapter?: ReadChapter;
  chapterLinkProps?: Omit<LinkProps, "href">;
}

export interface EpisodeButtonProps {
  episode: Episode;
  media?: Media;
  episodes: Episode[];
  activeEpisode?: Episode;
  watchedEpisode?: WatchedEpisode;
}

export enum EpisodeShowType {
  Thumbnail = "thumbnail",
  Grid = "grid",
}

const CHAPTER_CHUNK = isMobileOnly ? 5 : 10;

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

const ChapterSelector: React.FC<ChapterSelectorProps> = ({
  chapters,
  sourceId,
  media,
  activeChapter,
  readChapter,
  chapterLinkProps,
}) => {
  const savedActiveChunkIndex = useRef<number>(0);
  const containerEl = useRef<HTMLDivElement>(null);
  const [swiper, setSwiper] = useState<SwiperInstance>();

  const readChapterNumber = useMemo(
    () =>
      readChapter?.chapter?.number
        ? parseNumberFromString(readChapter?.chapter?.number)
        : null,
    [readChapter?.chapter?.number]
  );

  const sections = useMemo(
    () => groupBy(chapters, (chapter) => chapter.section),
    [chapters]
  );

  const [activeSection, setActiveSection] = useState(() => {
    const sectionHasMostChapters = Object.keys(sections).sort((a, b) => {
      return sections[b].length - sections[a].length;
    });

    return sectionHasMostChapters[0];
  });

  const sectionChapters = useMemo(() => {
    return sections[activeSection] || [];
  }, [activeSection, sections]);

  const chunks = useMemo(
    () => chunk(sectionChapters, CHAPTER_CHUNK),
    [sectionChapters]
  );

  const [activeChunk, setActiveChunk] = useState(() => {
    return (
      chunks.find((chunk) =>
        chunk.some(
          (chapter) =>
            chapter.id === activeChapter?.id ||
            parseNumberFromString(chapter.number) === readChapterNumber
        )
      ) || chunks.sort((a, b) => b.length - a.length)[0]
    );
  });

  const activeChunkIndex = useMemo(() => {
    return chunks.findIndex((chunk) => chunk === activeChunk);
  }, [activeChunk, chunks]);

  const chunkOptions = useMemo(() => {
    const options = chunks.map((chunk, i) => {
      const firstChapterName = parseNumberFromString(
        chunk[0].number,
        chunk[0].number
      );
      const lastChapterName = parseNumberFromString(
        chunk[chunk.length - 1].number,
        chunk[chunk.length - 1].number
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

  const sectionOptions = useMemo(() => {
    const sectionKeys = Object.keys(sections).filter(
      (section) => section && section !== "null" && section !== "undefined"
    );

    if (!sectionKeys.length) {
      return [];
    }

    return sectionKeys.map((section) => {
      return {
        value: section,
        label: section === "null" ? "Default" : section,
      };
    });
  }, [sections]);

  const activeSectionOption = useMemo(() => {
    return sectionOptions.find((option) => option.value === activeSection);
  }, [activeSection, sectionOptions]);

  const onChunkChange = ({ value }) => {
    setActiveChunk(value);

    const index = chunks.findIndex((chunk) => chunk === value);

    savedActiveChunkIndex.current = index;
  };

  const onSectionChange = ({ value }) => {
    setActiveSection(value);
  };

  useEffect(() => {
    const sectionHasMostEpisodes = Object.keys(sections).sort((a, b) => {
      return sections[b].length - sections[a].length;
    });

    setActiveSection(sectionHasMostEpisodes[0]);
  }, [sections]);

  useEffect(() => {
    const chunk = chunks.find((chunk) =>
      chunk.some(
        (episode) =>
          episode.id === activeChapter?.id ||
          parseNumberFromString(episode.number) === readChapterNumber
      )
    );

    let fallbackChunk = null;

    if (savedActiveChunkIndex.current === -1) {
      fallbackChunk = chunks[0];
    } else if (savedActiveChunkIndex.current < chunks.length) {
      fallbackChunk = chunks[savedActiveChunkIndex.current];
    } else {
      fallbackChunk = chunks[0];
    }

    setActiveChunk(chunk || fallbackChunk);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    savedActiveChunkIndex.current,
    activeChapter?.id,
    chunks,
    readChapterNumber,
  ]);

  useEffect(() => {
    if (!swiper) return;

    swiper.slideTo(activeChunkIndex, 300);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChunkIndex]);

  useEffect(() => {
    if (!swiper) return;

    swiper.activeIndex = savedActiveChunkIndex.current;
    swiper.update();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chunkOptions]);

  const handleSwiperInit = useCallback((swiper: SwiperInstance) => {
    setSwiper(swiper);
  }, []);

  return (
    <React.Fragment>
      <div
        ref={containerEl}
        className="flex flex-col md:flex-row md:items-center items-end gap-4"
      >
        <HeadlessSwiper
          onInit={handleSwiperInit}
          defaultValue={activeChunkIndex}
          className="overflow-hidden grow w-full"
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

        {sectionOptions.length ? (
          <Select
            className="shrink-0"
            options={sectionOptions}
            isClearable={false}
            isSearchable={false}
            defaultValue={activeSectionOption}
            value={activeSectionOption}
            onChange={onSectionChange}
          />
        ) : null}
      </div>

      <div className="mt-4 space-y-2 overflow-hidden">
        {chapters.map((chapter) => {
          const isRead =
            parseNumberFromString(chapter.number) <= readChapterNumber;

          return (
            <Link
              href={`/manga/read/${media.id}/${sourceId}/${chapter.id}`}
              key={chapter.id}
              {...chapterLinkProps}
            >
              <a className="relative block p-2 bg-background-800 hover:bg-white/20 duration-300 transition">
                <p className="line-clamp-1 text-sm font-semibold">
                  {chapter.number} {chapter.title && ` - ${chapter.title}`}
                </p>

                {isRead && (
                  <div className="absolute left-0 top-0 w-0.5 h-full bg-primary-500"></div>
                )}
              </a>
            </Link>
          );
        })}
      </div>
    </React.Fragment>
  );
};

export default ChapterSelector;
