import Loading from "@/components/shared/Loading";
import Popup from "@/components/shared/Popup";
import Select from "@/components/shared/Select";
import useEpisodes from "@/hooks/useEpisodes";
import useSources, { SourceType } from "@/hooks/useSources";
import { Media } from "@/types/anilist";
import { Source } from "@/types/core";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import EpisodeSelector, { EpisodeSelectorProps } from "./EpisodeSelector";
import useWatchedEpisode from "@/hooks/useWatchedEpisode";

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
  const [videoContainer, setVideoContainer] = useState<HTMLElement>();
  const containerEl = useRef<HTMLDivElement>(null);

  const { asPath } = useRouter();

  const { data: sources, isLoading, isError } = useSources(SourceType.Anime);

  const languages = useMemo(() => {
    if (!sources?.length) return [];

    return Array.from(new Set(sources.flatMap((source) => source.languages)));
  }, [sources]);

  const [activeLanguage, setActiveLanguage] = useState<string>(languages?.[0]);

  const languageSources = useMemo(() => {
    if (!sources?.length) return [];
    if (!activeLanguage) return [];

    return sources.filter((source) =>
      source.languages.includes(activeLanguage)
    );
  }, [activeLanguage, sources]);

  const [activeSource, setActiveSource] = useState<Source>(
    languageSources?.[0]
  );
  const {
    data: episodes,
    isLoading: episodesLoading,
    isError: episodesError,
  } = useEpisodes(media, activeSource?.id, { enabled: !!activeSource?.id });

  const { data: watchedEpisodeData, isLoading: watchedEpisodeDataLoading } =
    useWatchedEpisode(media.id, activeSource?.id);

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
    if (!sources?.length) return;

    setActiveSource(sources[0]);
  }, [sources]);

  useEffect(() => {
    if (!languages?.length) return;

    const activeLanguage = languages[0];

    setActiveLanguage(activeLanguage);
  }, [languages]);

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

      {episodesLoading || watchedEpisodeDataLoading ? (
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
