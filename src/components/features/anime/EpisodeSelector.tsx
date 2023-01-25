import ArrowSwiper, {
  SwiperProps,
  SwiperSlide,
} from "@/components/shared/ArrowSwiper";
import Link from "@/components/shared/Link";
import { Episode, Watched } from "@/types";
import { Media } from "@/types/anilist";
import { chunk, groupBy, parseNumberFromString } from "@/utils";
import classNames from "classnames";
import { LinkProps } from "next/link";
import React, { useMemo } from "react";
import { isMobileOnly } from "react-device-detect";

export interface EpisodeSelectorProps {
  episodes: Episode[];
  mediaId?: number;
  activeEpisode?: Episode;
  chunkSwiperProps?: SwiperProps;
  episodeLinkProps?: Omit<LinkProps, "href">;
  onEachEpisode?: (episode: Episode) => React.ReactNode;
  episodeChunk?: number;
  watchedData?: Watched;
  media?: Media;
}

const EpisodeSelector: React.FC<EpisodeSelectorProps> = (props) => {
  const {
    watchedData,
    episodes,
    media,
    activeEpisode,
    chunkSwiperProps,
    episodeLinkProps,
    episodeChunk = isMobileOnly ? 12 : 24,
    onEachEpisode = (episode) => {
      const watchProgressPercent = (() => {
        if (watchedData?.episode?.episodeNumber === episode.episodeNumber) {
          if (media?.duration === null) return 100;

          const duration = media.duration * 1000;

          if (duration < watchedData?.watchedTime) return 100;

          const percent = (watchedData?.watchedTime / duration) * 100;

          return percent < 10 ? 10 : percent;
        }

        // If episodeNumber is 0, it mean it is a special episode.
        if (episode.episodeNumber === 0 && episodes.length > 1) return 0;

        if (episode.episodeNumber < watchedData?.episode?.episodeNumber)
          return 100;

        return 0;
      })();

      return (
        <Link
          href={`/anime/watch/${props.mediaId}/${episode.sourceId}/${episode.sourceEpisodeId}`}
          key={episode.sourceEpisodeId}
          shallow
          {...episodeLinkProps}
        >
          <a
            className={classNames(
              "relative rounded-md bg-background-800 col-span-1 aspect-w-2 aspect-h-1 group",
              episode.sourceEpisodeId === activeEpisode?.sourceEpisodeId
                ? "text-primary-300"
                : watchedData?.episode?.episodeNumber >=
                    episode.episodeNumber && "text-white/70"
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
                ></div>
              )}
            </div>
          </a>
        </Link>
      );
    },
  } = props;

  const chunks = useMemo(
    () => chunk(episodes, episodeChunk),
    [episodeChunk, episodes]
  );

  const [activeTabIndex, setActiveTabIndex] = React.useState(() => {
    const index = chunks.findIndex((chunk) =>
      chunk.some(
        (episode) => episode.sourceEpisodeId === activeEpisode?.sourceEpisodeId
      )
    );

    return index === -1 ? 0 : index;
  });

  const realActiveTabIndex = useMemo(
    () => (activeTabIndex > chunks.length - 1 ? 0 : activeTabIndex),
    [activeTabIndex, chunks.length]
  );

  const sections = useMemo(
    () => groupBy(chunks[realActiveTabIndex], (episode) => episode.section),
    [chunks, realActiveTabIndex]
  );

  return (
    <React.Fragment>
      <ArrowSwiper
        isOverflowHidden={false}
        className="w-11/12 mx-auto"
        defaultActiveSlide={realActiveTabIndex}
        {...chunkSwiperProps}
      >
        {chunks.map((chunk, i) => {
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

          return (
            <SwiperSlide onClick={() => setActiveTabIndex(i)} key={i}>
              <div
                className={classNames(
                  "text-gray-300 cursor-pointer mx-auto rounded-[18px] px-2 py-1 w-[max-content] duration-300 transition",
                  realActiveTabIndex === i
                    ? "bg-white text-black"
                    : "hover:text-white"
                )}
              >
                {title}
              </div>
            </SwiperSlide>
          );
        })}
      </ArrowSwiper>

      <div className="mt-10 space-y-4">
        {watchedData?.episode && (
          <div className="flex items-center gap-4">
            <p className="shrink-0">Continue watching: </p>

            <div className="grid grid-cols-1 w-28">
              {onEachEpisode(watchedData.episode)}
            </div>
          </div>
        )}

        {Object.keys(sections).map((section) => {
          const episodes = sections[section];

          return (
            <div className="space-y-1" key={section}>
              {Object.keys(sections)?.length > 1 && (
                <p className="font-semibold text-gray-300">
                  {section === "null" || !section ? "Default" : section}
                </p>
              )}

              <div className="grid xl:grid-cols-8 lg:grid-cols-7 md:grid-cols-6 sm:grid-cols-5 grid-cols-4 gap-4">
                {episodes.map(onEachEpisode)}
              </div>
            </div>
          );
        })}
      </div>
    </React.Fragment>
  );
};

export default React.memo(EpisodeSelector);
