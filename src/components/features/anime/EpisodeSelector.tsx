import Link from "@/components/shared/Link";
import Select from "@/components/shared/Select";
import { Episode, Watched } from "@/types";
import { Media } from "@/types/anilist";
import { chunk, groupBy, parseNumberFromString } from "@/utils";
import classNames from "classnames";
import { LinkProps } from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { isMobileOnly } from "react-device-detect";
import { HiOutlineViewGrid } from "react-icons/hi";
import { IoMdImage } from "react-icons/io";
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
        "relative rounded-md bg-background-800 col-span-1 aspect-w-2 aspect-h-1 group",
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
    </div>
  );
};

const EpisodeSelector: React.FC<EpisodeSelectorProps> = (props) => {
  const [showType, setShowType] = useState<EpisodeShowType>(() => {
    if (isMobileOnly) return EpisodeShowType.Grid;

    if (props.episodes.some((episode) => episode.thumbnail && episode.title))
      return EpisodeShowType.Thumbnail;

    return EpisodeShowType.Grid;
  });

  const { asPath } = useRouter();

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
              />
            </a>
          )}
        </Link>
      );
    },
  } = props;

  const [videoContainer, setVideoContainer] = useState<HTMLElement>();

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

  const activeChunkOption = useMemo(() => {
    return chunkOptions.find((option) => option.value === activeChunk);
  }, [activeChunk, chunkOptions]);

  const sectionOptions = useMemo(() => {
    if (Object.keys(sections).length <= 1) {
      return [];
    }

    return Object.keys(sections).map((section) => {
      return {
        value: section,
        label: section,
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

    setVideoContainer(videoElement);
  }, [asPath]);

  useEffect(() => {
    const sectionHasMostEpisodes = Object.keys(sections).sort((a, b) => {
      return sections[b].length - sections[a].length;
    });

    setActiveSection(sectionHasMostEpisodes[0]);
  }, [sections]);

  useEffect(() => {
    setActiveChunk(
      chunks.find((chunk) =>
        chunk.some(
          (episode) =>
            episode.sourceEpisodeId === activeEpisode?.sourceEpisodeId ||
            episode.episodeNumber === watchedData?.episode?.episodeNumber
        )
      ) || chunks.sort((a, b) => b.length - a.length)[0]
    );
  }, [
    activeEpisode?.sourceEpisodeId,
    chunks,
    watchedData?.episode?.episodeNumber,
  ]);

  return (
    <React.Fragment>
      <div className="flex flex-col md:flex-row md:justify-end items-end md:items-start gap-4">
        <Select
          options={chunkOptions}
          isClearable={false}
          defaultValue={activeChunkOption}
          value={activeChunkOption}
          onChange={onChunkChange}
          menuPortalTarget={videoContainer}
        />

        {sectionOptions.length ? (
          <Select
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

      <div className="mt-10 space-y-4 max-h-80 overflow-y-auto">
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
