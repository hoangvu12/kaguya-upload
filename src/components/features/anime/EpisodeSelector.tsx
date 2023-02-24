import HeadlessSwiper, {
  SwiperInstance,
  SwiperSlide,
} from "@/components/shared/HeadlessSwiper";
import Link from "@/components/shared/Link";
import Select from "@/components/shared/Select";
import { Episode, Watched } from "@/types";
import { Media } from "@/types/anilist";
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
import { SwiperOptions } from "swiper";
import EpisodeCard from "./EpisodeCard";

export interface EpisodeSelectorProps {
  episodes: Episode[];
  mediaId?: number;
  activeEpisode?: Episode;
  episodeLinkProps?: Omit<LinkProps, "href">;
  onEachEpisode?: (episode: Episode) => React.ReactNode;
  episodeChunk?: number;
  watchedData?: Watched;
  media?: Media;
}

export interface EpisodeButtonProps {
  episode: Episode;
  watchedData?: Watched;
  media?: Media;
  episodes: Episode[];
  activeEpisode?: Episode;
}

export enum EpisodeShowType {
  Thumbnail = "thumbnail",
  Grid = "grid",
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

const EpisodeButton: React.FC<EpisodeButtonProps> = ({
  media,
  episode,
  watchedData,
  episodes,
  activeEpisode,
}) => {
  const watchProgressPercent = useMemo(() => {
    if (watchedData?.episode?.episodeNumber === episode.episodeNumber) {
      if (media?.duration === null) return 100;

      const duration = media.duration * 60;

      if (duration < watchedData?.watchedTime) return 100;

      const percent = (watchedData?.watchedTime / duration) * 100;

      return percent < 10 ? 10 : percent;
    }

    // If episodeNumber is 0, it mean it is a special episode.
    if (episode.episodeNumber === 0 && episodes.length > 1) return 0;

    if (episode.episodeNumber < watchedData?.episode?.episodeNumber) return 100;

    return 0;
  }, [
    episode.episodeNumber,
    episodes.length,
    media.duration,
    watchedData?.episode?.episodeNumber,
    watchedData?.watchedTime,
  ]);

  return (
    <div
      className={classNames(
        "relative rounded-md bg-background-700 col-span-1 aspect-w-2 aspect-h-1 group",
        episode.sourceEpisodeId === activeEpisode?.sourceEpisodeId
          ? "text-primary-300"
          : watchedData?.episode?.episodeNumber >= episode.episodeNumber &&
              "text-white/70"
      )}
    >
      <div className="flex items-center justify-center w-full h-full group-hover:bg-white/10 rounded-md transition duration-300">
        <p>{episode.name}</p>
      </div>

      <div className="absolute w-full h-full">
        {watchedData?.episode?.episodeNumber >= episode.episodeNumber && (
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

const EpisodeSelector: React.FC<EpisodeSelectorProps> = (props) => {
  const [swiper, setSwiper] = useState<SwiperInstance>();
  const [showType, setShowType] = useState<EpisodeShowType>(() => {
    if (isMobileOnly) return EpisodeShowType.Grid;

    if (props.episodes.some((episode) => episode.thumbnail && episode.title))
      return EpisodeShowType.Thumbnail;

    return EpisodeShowType.Grid;
  });

  const { asPath } = useRouter();
  const containerEl = useRef<HTMLDivElement>(null);

  const {
    watchedData,
    episodes,
    media,
    activeEpisode,
    episodeLinkProps,
    episodeChunk = isMobileOnly ? 12 : 24,
    onEachEpisode = (episode) => {
      const watchedTime = (() => {
        if (watchedData?.episode?.episodeNumber === episode.episodeNumber) {
          return watchedData?.watchedTime;
        }

        // If episodeNumber is 0, it mean it is a special episode.
        if (episode.episodeNumber === 0 && episodes.length > 1) return 0;

        if (episode.episodeNumber < watchedData?.episode?.episodeNumber)
          return media?.duration * 60;

        return 0;
      })();

      return (
        <Link
          href={`/anime/watch/${props.mediaId}/${episode.sourceId}/${episode.sourceEpisodeId}`}
          key={episode.sourceEpisodeId}
          shallow
          {...episodeLinkProps}
        >
          {showType === EpisodeShowType.Grid ? (
            <a>
              <EpisodeButton episode={episode} {...props} />
            </a>
          ) : (
            <a>
              <EpisodeCard
                episode={episode}
                watchedTime={watchedTime}
                media={media}
                duration={media.duration * 60}
                isActive={
                  episode.sourceEpisodeId === activeEpisode?.sourceEpisodeId
                }
              />
            </a>
          )}
        </Link>
      );
    },
  } = props;

  const [videoContainer, setVideoContainer] = useState<HTMLElement>();
  const savedActiveChunkIndex = useRef<number>(0);

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
    () => chunk(sectionEpisodes, episodeChunk),
    [episodeChunk, sectionEpisodes]
  );

  const [activeChunk, setActiveChunk] = useState(() => {
    return (
      chunks.find((chunk) =>
        chunk.some(
          (episode) =>
            episode.sourceEpisodeId === activeEpisode?.sourceEpisodeId ||
            episode.episodeNumber === watchedData?.episode?.episodeNumber
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
        chunk[0].name,
        chunk[0].name
      );
      const lastEpisodeName = parseNumberFromString(
        chunk[chunk.length - 1].name,
        chunk[chunk.length - 1].name
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
      (section) => section && section !== "null"
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

  const watchedSourceEpisode = useMemo(() => {
    const watchedEpisode = watchedData?.episode;

    if (!watchedEpisode) return null;
    if (!activeChunk) return watchedEpisode;

    const watchedEpisodeNumber = watchedEpisode.episodeNumber;

    const watchedEpisodeInActiveChunk = activeChunk.find(
      (chunk) => chunk.episodeNumber === watchedEpisodeNumber
    );

    if (!watchedEpisodeInActiveChunk) return watchedEpisode;

    return watchedEpisodeInActiveChunk;
  }, [activeChunk, watchedData?.episode]);

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
          episode.sourceEpisodeId === activeEpisode?.sourceEpisodeId ||
          episode.episodeNumber === watchedData?.episode?.episodeNumber
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
    activeEpisode?.sourceEpisodeId,
    chunks,
    watchedData?.episode?.episodeNumber,
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
        {watchedSourceEpisode && (
          <div className="flex items-center gap-4">
            <p className="shrink-0">Continue watching: </p>

            <div className="grid grid-cols-1 w-28">
              <Link
                href={`/anime/watch/${props.mediaId}/${watchedSourceEpisode.sourceId}/${watchedSourceEpisode.sourceEpisodeId}`}
                key={watchedSourceEpisode.sourceEpisodeId}
                shallow
                {...episodeLinkProps}
              >
                <a>
                  <EpisodeButton episode={watchedSourceEpisode} {...props} />
                </a>
              </Link>
            </div>
          </div>
        )}

        {activeChunk?.length && (
          <div
            className={classNames(
              showType === EpisodeShowType.Grid
                ? "xl:grid-cols-8 lg:grid-cols-7 md:grid-cols-6 sm:grid-cols-5 grid-cols-4"
                : "xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 grid-cols-1",
              "grid gap-4"
            )}
          >
            {activeChunk.map(onEachEpisode)}
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default React.memo(EpisodeSelector);
