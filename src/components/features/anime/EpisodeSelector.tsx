import HeadlessSwiper, {
  SwiperInstance,
  SwiperSlide,
} from "@/components/shared/HeadlessSwiper";
import Link from "@/components/shared/Link";
import Select from "@/components/shared/Select";
import { Media } from "@/types/anilist";
import { Episode, WatchedEpisode } from "@/types/core";
import { chunk, groupBy, parseNumberFromString } from "@/utils";
import classNames from "classnames";
import { LinkProps } from "next/link";
import { useRouter } from "next/router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { isMobileOnly } from "react-device-detect";
import { HiOutlineViewGrid } from "react-icons/hi";
import { IoMdImage } from "react-icons/io";
import Swiper, { Mousewheel, SwiperOptions } from "swiper";
import EpisodeCard from "./EpisodeCard";
import { useTranslation } from "next-i18next";

export interface EpisodeSelectorProps {
  episodes: Episode[];
  sourceId: string;
  media: Media;
  activeEpisode?: Episode;
  watchedEpisode?: WatchedEpisode;
  episodeLinkProps?: Omit<LinkProps, "href">;
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

Swiper.use([Mousewheel]);

const EPISODE_CHUNK = isMobileOnly ? 12 : 24;

const swiperOptions: SwiperOptions = {
  spaceBetween: 10,
  mousewheel: true,
  keyboard: true,
  freeMode: true,
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

const EpisodeButton: React.FC<EpisodeButtonProps> = ({
  media,
  episode,
  episodes,
  activeEpisode,
  watchedEpisode,
}) => {
  const episodeTitle = useMemo(() => {
    return episode.title;
  }, [episode.title]);

  const watchedEpisodeNumber = useMemo(
    () =>
      watchedEpisode?.episode?.number
        ? parseNumberFromString(watchedEpisode?.episode?.number)
        : null,
    [watchedEpisode?.episode?.number]
  );

  const episodeNumber = useMemo(
    () => parseNumberFromString(episode.number),
    [episode.number]
  );

  const watchProgressPercent = useMemo(() => {
    if (!watchedEpisode) return 0;

    if (watchedEpisodeNumber === episodeNumber) {
      if (media?.duration === null) return 100;

      const duration = media.duration * 60;

      if (duration < watchedEpisode?.time) return 100;

      const percent = (watchedEpisode?.time / duration) * 100;

      return percent < 10 ? 10 : percent;
    }

    // If episodeNumber is 0, it mean it is a special episode.
    if (episodeNumber === 0 && episodes.length > 1) return 0;

    if (episodeNumber < watchedEpisodeNumber) return 100;

    return 0;
  }, [
    episodeNumber,
    episodes.length,
    media?.duration,
    watchedEpisode,
    watchedEpisodeNumber,
  ]);

  return (
    <div
      title={episodeTitle}
      className={classNames(
        "relative rounded-md bg-background-700 col-span-1 aspect-w-2 aspect-h-1 group/button",
        episode.id === activeEpisode?.id
          ? "text-primary-300"
          : watchedEpisodeNumber >= episodeNumber && "text-white/70"
      )}
    >
      <div className="flex items-center justify-center w-full h-full group-hover/button:bg-white/10 rounded-md transition duration-300">
        <p>{episode.number}</p>
      </div>

      <div className="absolute w-full h-full">
        {watchedEpisodeNumber >= episodeNumber && (
          <div
            className="absolute bottom-0 h-0.5 bg-primary-500"
            style={{ width: `${watchProgressPercent}%` }}
          />
        )}
      </div>

      {episode.isFiller && (
        <p className="absolute w-[max-content] h-[max-content] -top-2 -right-4 p-1 text-xs text-white bg-primary-500 rounded-md">
          Filler
        </p>
      )}
    </div>
  );
};

const EpisodeSelector: React.FC<EpisodeSelectorProps> = ({
  episodes,
  sourceId,
  media,
  activeEpisode,
  watchedEpisode,
  episodeLinkProps,
}) => {
  const [videoContainer, setVideoContainer] = useState<HTMLElement>();
  const savedActiveChunkIndex = useRef<number>(0);
  const [showType, setShowType] = useState<EpisodeShowType>(() => {
    if (isMobileOnly) return EpisodeShowType.Grid;

    if (episodes.some((episode) => episode.thumbnail))
      return EpisodeShowType.Thumbnail;

    return EpisodeShowType.Grid;
  });
  const containerEl = useRef<HTMLDivElement>(null);
  const [swiper, setSwiper] = useState<SwiperInstance>();
  const { t } = useTranslation("episode-selector");

  const watchedEpisodeNumber = useMemo(
    () =>
      watchedEpisode?.episode?.number
        ? parseNumberFromString(watchedEpisode?.episode?.number)
        : null,
    [watchedEpisode?.episode?.number]
  );

  const sections = useMemo(
    () => groupBy(episodes, (episode) => episode.section),
    [episodes]
  );

  const [activeSection, setActiveSection] = useState(() => {
    const sectionHasMostEpisodes = Object.keys(sections).sort((a, b) => {
      return sections[b].length - sections[a].length;
    });

    return sectionHasMostEpisodes[0];
  });

  const sectionEpisodes = useMemo(() => {
    return sections[activeSection] || [];
  }, [activeSection, sections]);

  const chunks = useMemo(
    () => chunk(sectionEpisodes, EPISODE_CHUNK),
    [sectionEpisodes]
  );

  const { asPath } = useRouter();

  const [activeChunk, setActiveChunk] = useState(() => {
    return (
      chunks.find((chunk) =>
        chunk.some(
          (episode) =>
            episode.id === activeEpisode?.id ||
            parseNumberFromString(episode.number) === watchedEpisodeNumber
        )
      ) || chunks.sort((a, b) => b.length - a.length)[0]
    );
  });

  const activeChunkIndex = useMemo(() => {
    return chunks.findIndex((chunk) => chunk === activeChunk);
  }, [activeChunk, chunks]);

  const chunkOptions = useMemo(() => {
    const options = chunks.map((chunk, i) => {
      const firstEpisodeName = parseNumberFromString(
        chunk[0].number,
        chunk[0].number
      );
      const lastEpisodeName = parseNumberFromString(
        chunk[chunk.length - 1].number,
        chunk[chunk.length - 1].number
      );

      const title =
        chunk.length === 1
          ? `${firstEpisodeName}`
          : `${firstEpisodeName} - ${lastEpisodeName}`;

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

  const handleChangeShowType = (type: EpisodeShowType) => () => {
    setShowType(type);
  };

  useEffect(() => {
    const videoElement: HTMLDivElement = document.querySelector(
      ".netplayer-container"
    );

    if (!videoElement || !asPath.includes("/watch/")) {
      setVideoContainer(document.body);

      return;
    }

    // check if container el is inside video container
    if (videoElement.contains(containerEl.current)) {
      setVideoContainer(videoElement);
    }
  }, [asPath]);

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
          episode.id === activeEpisode?.id ||
          parseNumberFromString(episode.number) === watchedEpisodeNumber
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
    activeEpisode?.id,
    chunks,
    watchedEpisodeNumber,
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
            menuPortalTarget={videoContainer}
          />
        ) : null}
      </div>

      <div className="mt-4 flex flex-row justify-end gap-1">
        <HiOutlineViewGrid
          onClick={handleChangeShowType(EpisodeShowType.Grid)}
          className={classNames(
            "cursor-pointer w-6 h-6",
            EpisodeShowType.Grid === showType ? "text-white" : "text-gray-600"
          )}
        />

        <IoMdImage
          onClick={handleChangeShowType(EpisodeShowType.Thumbnail)}
          className={classNames(
            "cursor-pointer w-6 h-6",
            EpisodeShowType.Thumbnail === showType
              ? "text-white"
              : "text-gray-600"
          )}
        />
      </div>

      <div className="mt-10 space-y-4 max-h-96 overflow-y-auto">
        {watchedEpisode?.episode && (
          <div className="flex items-center gap-4">
            <p className="shrink-0">{t("continue_watching")}: </p>

            <div className="grid grid-cols-1 w-28">
              <Link
                href={`/anime/watch/${media.id}/${sourceId}/${watchedEpisode.episode.id}`}
                key={watchedEpisode.episode.id}
                shallow
                {...episodeLinkProps}
              >
                <a>
                  <EpisodeButton
                    media={media}
                    episodes={episodes}
                    episode={watchedEpisode.episode}
                    activeEpisode={activeEpisode}
                    watchedEpisode={watchedEpisode}
                  />
                </a>
              </Link>
            </div>
          </div>
        )}

        <div
          className={classNames(
            showType === EpisodeShowType.Grid
              ? "xl:grid-cols-8 lg:grid-cols-7 md:grid-cols-6 sm:grid-cols-5 grid-cols-4"
              : "xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 grid-cols-1",
            "mt-8 grid gap-4"
          )}
        >
          {activeChunk?.map((episode) => {
            const episodeNumber = parseNumberFromString(episode.number);

            const watchTime = (() => {
              if (!watchedEpisode) return 0;

              if (watchedEpisodeNumber === episodeNumber) {
                if (media?.duration === null) return 0;

                const duration = media.duration * 60;

                if (duration < watchedEpisode?.time) return duration;

                return watchedEpisode?.time;
              }

              // If episodeNumber is 0, it mean it is a special episode.
              if (episodeNumber === 0 && episodes.length > 1) return 0;

              if (episodeNumber < watchedEpisodeNumber)
                return media.duration * 60;

              return 0;
            })();

            return (
              <Link
                href={`/anime/watch/${media.id}/${sourceId}/${episode.id}`}
                key={episode.id}
                shallow
                {...episodeLinkProps}
              >
                <a>
                  {showType === EpisodeShowType.Grid ? (
                    <EpisodeButton
                      media={media}
                      episodes={episodes}
                      episode={episode}
                      activeEpisode={activeEpisode}
                      watchedEpisode={watchedEpisode}
                    />
                  ) : (
                    <EpisodeCard
                      episode={episode}
                      watchedTime={watchTime}
                      media={media}
                      duration={media.duration * 60}
                      isActive={episode.id === activeEpisode?.id}
                      displayMediaTitle={false}
                    />
                  )}
                </a>
              </Link>
            );
          })}
        </div>
      </div>
    </React.Fragment>
  );
};

export default EpisodeSelector;
