import Loading from "@/components/shared/Loading";
import Select from "@/components/shared/Select";
import WrongTitle from "@/components/shared/WrongTitle";
import useAnimeId from "@/hooks/useAnimeId";
import useEpisodes from "@/hooks/useEpisodes";
import useSources, { SourceType } from "@/hooks/useSources";
import useWatchedEpisode from "@/hooks/useWatchedEpisode";
import { Media, MediaType } from "@/types/anilist";
import { Source } from "@/types/core";
import { getByISO6391, getByTag } from "locale-codes";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import EpisodeSelector, { EpisodeSelectorProps } from "./EpisodeSelector";

interface SourceEpisodeSelectorProps extends Partial<EpisodeSelectorProps> {
  media: Media;
}

const sourcesToOptions = (sources: Source[]) => sources.map(sourceToOption);

const sourceToOption = (source: Source) => {
  return { value: source.id, label: source.name };
};

const SourceEpisodeSelector: React.FC<SourceEpisodeSelectorProps> = ({
  media,
  ...props
}) => {
  const isNSFW = useMemo(() => media.isAdult, [media?.isAdult]);

  const [videoContainer, setVideoContainer] = useState<HTMLElement>();
  const containerEl = useRef<HTMLDivElement>(null);

  const { asPath, locale } = useRouter();

  const { data: sources, isLoading, isError } = useSources(SourceType.Anime);

  const nsfwSources = useMemo(() => {
    if (!sources?.length) return [];

    return sources.filter((source) => source.isNSFW);
  }, [sources]);

  const nonNSFWSources = useMemo(() => {
    if (!sources?.length) return [];

    return sources.filter((source) => !source.isNSFW);
  }, [sources]);

  const languages = useMemo(() => {
    if (!sources?.length) return [];

    return Array.from(new Set(sources.flatMap((source) => source.languages)));
  }, [sources]);

  const [activeLanguage, setActiveLanguage] = useState<string>(() => {
    const userLanguage = (() => {
      if (locale.includes("-")) {
        return getByTag(locale).name;
      }

      return getByISO6391(locale).name;
    })();

    let activeLanguage = languages[0];

    if (languages.includes(userLanguage)) {
      activeLanguage = userLanguage;
    }

    return activeLanguage;
  });

  const languageSources = useMemo(() => {
    if (!sources?.length) return [];
    if (!activeLanguage) return [];

    // If NSFW then put NSFW sources on top
    const typeSources = isNSFW
      ? [...nsfwSources, ...nonNSFWSources]
      : nonNSFWSources;

    return typeSources.filter((source) =>
      source.languages.includes(activeLanguage)
    );
  }, [activeLanguage, isNSFW, nonNSFWSources, nsfwSources, sources]);

  const [activeSource, setActiveSource] = useState<Source>(
    languageSources?.[0]
  );

  const { data: animeIdData, isLoading: animeIdLoading } = useAnimeId(
    media,
    activeSource?.id
  );

  const { data: episodes, isLoading: episodesLoading } = useEpisodes(
    media,
    activeSource?.id,
    animeIdData
  );

  const { data: watchedEpisodeData, isLoading: watchedEpisodeDataLoading } =
    useWatchedEpisode(media.id);

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
    if (!languageSources?.length) return;

    setActiveSource(languageSources[0]);
  }, [languageSources]);

  useEffect(() => {
    if (!languages?.length) return;

    const userLanguage = (() => {
      if (locale.includes("-")) {
        return getByTag(locale).name;
      }

      return getByISO6391(locale).name;
    })();

    let activeLanguage = languages[0];

    if (languages.includes(userLanguage)) {
      activeLanguage = userLanguage;
    }

    setActiveLanguage(activeLanguage);
  }, [languages, locale]);

  if (isLoading) {
    return (
      <div className="relative w-full h-full min-h-[4rem] flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-center justify-center text-2xl font-semibold">
        Something went wrong
      </p>
    );
  }

  return (
    <React.Fragment>
      <div ref={containerEl} className="flex justify-end w-full mx-auto mb-8">
        <div className="flex md:items-center flex-col md:flex-row gap-2">
          {activeSource?.id && (
            <WrongTitle
              sourceId={activeSource.id}
              mediaType={MediaType.Anime}
              anilist={media}
            />
          )}

          <div className="flex items-center flex-wrap justify-end gap-2">
            {languages?.length && (
              <Select
                id="language-selector"
                options={languages.map((language) => ({
                  value: language,
                  label: language,
                }))}
                onChange={({ value }: any) => {
                  setActiveLanguage(value);

                  const source = sources.find((source) =>
                    source.languages.includes(value)
                  );

                  setActiveSource(source);
                }}
                value={{ value: activeLanguage, label: activeLanguage }}
                isClearable={false}
                isSearchable={false}
                menuPortalTarget={videoContainer}
              />
            )}

            <Select
              id="source-selector"
              options={sourcesToOptions(languageSources)}
              onChange={({ value }: any) => {
                const source = languageSources.find(
                  (source) => source.id === value
                );

                setActiveSource(source);
              }}
              value={activeSource?.id ? sourceToOption(activeSource) : null}
              isClearable={false}
              isSearchable={false}
              menuPortalTarget={videoContainer}
            />
          </div>
        </div>
      </div>

      {episodesLoading || watchedEpisodeDataLoading || animeIdLoading ? (
        <div className="relative w-full h-full min-h-[4rem] flex items-center justify-center">
          <Loading />
        </div>
      ) : episodes?.length ? (
        <EpisodeSelector
          media={media}
          episodes={episodes}
          sourceId={activeSource?.id}
          watchedEpisode={watchedEpisodeData}
          {...props}
        />
      ) : (
        <p className="text-center justify-center text-2xl font-semibold">
          No episodes were found
        </p>
      )}
    </React.Fragment>
  );
};

export default React.memo(SourceEpisodeSelector);
