import Loading from "@/components/shared/Loading";
import Select from "@/components/shared/Select";
import WrongTitle from "@/components/shared/WrongTitle";
import useChapters from "@/hooks/useChapters";
import useMangaId from "@/hooks/useMangaId";
import useReadChapter from "@/hooks/useReadChapter";
import useSources, { SourceType } from "@/hooks/useSources";
import { Media, MediaType } from "@/types/anilist";
import { Source } from "@/types/core";
import ISO6391 from "iso-639-1";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import ChapterSelector from "./ChapterSelector";

interface SourceChapterSelectorProps {
  media: Media;
}

const sourcesToOptions = (sources: Source[]) => sources.map(sourceToOption);

const sourceToOption = (source: Source) => {
  return { value: source.id, label: source.name };
};

const SourceChapterSelector: React.FC<SourceChapterSelectorProps> = ({
  media,
}) => {
  const [videoContainer, setVideoContainer] = useState<HTMLElement>();
  const containerEl = useRef<HTMLDivElement>(null);

  const { asPath, locale } = useRouter();

  const { data: sources, isLoading, isError } = useSources(SourceType.Manga);

  const languages = useMemo(() => {
    if (!sources?.length) return [];

    return Array.from(new Set(sources.flatMap((source) => source.languages)));
  }, [sources]);

  const [activeLanguage, setActiveLanguage] = useState<string>(() => {
    const userLanguage = ISO6391.getName(locale);

    let activeLanguage = languages[0];

    if (languages.includes(userLanguage)) {
      activeLanguage = userLanguage;
    }

    return activeLanguage;
  });

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

  const { data: mangaIdData, isLoading: mangaIdLoading } = useMangaId(
    media,
    activeSource?.id
  );

  console.log(mangaIdData);

  const { data: chapters, isLoading: chaptersLoading } = useChapters(
    media,
    activeSource?.id,
    mangaIdData,
    { enabled: !!activeSource?.id && !!mangaIdData }
  );
  const { data: readChapterData, isLoading: readChapterDataLoading } =
    useReadChapter(media.id);

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

    const userLanguage = ISO6391.getName(locale);

    let activeLanguage = languages[0];

    if (languages.includes(userLanguage)) {
      activeLanguage = userLanguage;
    }

    setActiveLanguage(activeLanguage);
  }, [languages, locale]);

  if (isLoading) {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
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
              anilist={media}
              mediaType={MediaType.Manga}
              sourceId={activeSource.id}
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

      {chaptersLoading || readChapterDataLoading || mangaIdLoading ? (
        <div className="relative w-full h-full min-h-[4rem] flex items-center justify-center">
          <Loading />
        </div>
      ) : chapters?.length ? (
        <ChapterSelector
          media={media}
          chapters={chapters}
          sourceId={activeSource?.id}
          readChapter={readChapterData}
        />
      ) : (
        <p className="text-center justify-center text-2xl font-semibold">
          No episodes were found
        </p>
      )}
    </React.Fragment>
  );
};

export default React.memo(SourceChapterSelector);
