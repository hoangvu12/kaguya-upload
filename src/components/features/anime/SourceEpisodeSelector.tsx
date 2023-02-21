import Popup from "@/components/shared/Popup";
import Select from "@/components/shared/Select";
import { groupBy, sortObjectByValue } from "@/utils";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import EpisodeSelector, { EpisodeSelectorProps } from "./EpisodeSelector";

export interface SourceEpisodeSelectorProps extends EpisodeSelectorProps {}

const sourcesToOptions = (sources: string[]) =>
  sources.map((source) => ({ value: source, label: source }));

const SourceEpisodeSelector: React.FC<SourceEpisodeSelectorProps> = ({
  episodes,
  activeEpisode,
  watchedData,
  ...episodeSelectorProps
}) => {
  const [videoContainer, setVideoContainer] = useState<HTMLElement>();
  const containerEl = useRef<HTMLDivElement>(null);

  const { asPath } = useRouter();

  const fastSources = useMemo(() => {
    const fastEpisodes = episodes.filter((episode) => episode.source.isFast);

    const sources = groupBy(fastEpisodes, (episode) => episode.source.name);

    const sortedSources = sortObjectByValue(
      sources,
      (a, b) => b.length - a.length
    );

    return sortedSources;
  }, [episodes]);

  const verifiedSources = useMemo(() => {
    const verifiedEpisodes = episodes.filter(
      (episode) => episode.source.isCustomSource && !episode.source.isFast
    );

    const sources = groupBy(verifiedEpisodes, (episode) => episode.source.name);

    const sortedSources = sortObjectByValue(
      sources,
      (a, b) => b.length - a.length
    );

    return sortedSources;
  }, [episodes]);

  const nonVerifiedSources = useMemo(() => {
    const nonVerifiedEpisodes = episodes.filter(
      (episode) => !episode.source.isCustomSource && !episode.source.isFast
    );

    const sources = groupBy(
      nonVerifiedEpisodes,
      (episode) => episode.source.name
    );

    const sortedSources = sortObjectByValue(
      sources,
      (a, b) => b.length - a.length
    );

    return sortedSources;
  }, [episodes]);

  const sources = useMemo(() => {
    return { ...fastSources, ...verifiedSources, ...nonVerifiedSources };
  }, [fastSources, nonVerifiedSources, verifiedSources]);

  const defaultActiveSource = useMemo(
    () =>
      Object.keys(sources).find((source) =>
        sources[source].some(
          (episode) =>
            episode.sourceEpisodeId === activeEpisode?.sourceEpisodeId ||
            episode.sourceEpisodeId === watchedData?.episode?.sourceEpisodeId
        )
      ),
    [
      sources,
      activeEpisode?.sourceEpisodeId,
      watchedData?.episode?.sourceEpisodeId,
    ]
  );

  const [activeSource, setActiveSource] = useState(
    defaultActiveSource || Object.keys(sources)[0]
  );

  const sourceEpisodes = useMemo(
    () => sources[activeSource],
    [sources, activeSource]
  );

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
              menuPortalTarget={videoContainer}
            />
          </div>
        </div>
      </div>

      <EpisodeSelector
        episodes={sourceEpisodes}
        activeEpisode={activeEpisode}
        watchedData={watchedData}
        {...episodeSelectorProps}
      />
    </React.Fragment>
  );
};

export default React.memo(SourceEpisodeSelector);
