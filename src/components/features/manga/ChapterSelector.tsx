import CircleButton from "@/components/shared/CircleButton";
import Link from "@/components/shared/Link";
import Select from "@/components/shared/Select";
import { Chapter, Read } from "@/types";
import {
  chunk,
  groupBy,
  parseNumberFromString,
  sortObjectByValue,
} from "@/utils";
import { motion } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";
import { isMobileOnly } from "react-device-detect";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";

export interface ChapterSelectorProps {
  chapters: Chapter[];
  mediaId: number;
  readData?: Read;
  chapterChunk?: number;
}

const sourcesToOptions = (sources: string[]) =>
  sources.map((source) => ({ value: source, label: source }));

const ChapterSelector: React.FC<ChapterSelectorProps> = ({
  chapters,
  mediaId,
  readData,
  chapterChunk = isMobileOnly ? 5 : 10,
}) => {
  const [activeSource, setActiveSource] = useState(() => {
    return readData?.chapter?.source.name || chapters[0].source.name;
  });

  const sourceChapters = useMemo(
    () => chapters.filter((chapter) => chapter.source.name === activeSource),
    [activeSource, chapters]
  );

  const sources = useMemo(
    () => groupBy(chapters, (data) => data.source.name),
    [chapters]
  );

  const verifiedSources = useMemo(() => {
    const verifiedChapters = chapters.filter(
      (chapter) => chapter.source.isCustomSource
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
      (chapter) => !chapter.source.isCustomSource
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

  const activeChunkOption = useMemo(() => {
    return chunkOptions.find((option) => option.value === activeChunk);
  }, [activeChunk, chunkOptions]);

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

  const onEachChapter = (chapter: Chapter) => {
    const isRead = chapter.chapterNumber <= readData?.chapter?.chapterNumber;

    return (
      <Link
        href={`/manga/read/${mediaId}/${chapter.sourceId}/${chapter.sourceChapterId}`}
        key={chapter.sourceChapterId}
      >
        <a className="relative block">
          <p className="line-clamp-1 bg-background-800 p-2 text-sm font-semibold hover:bg-white/20 duration-300 transition">
            {chapter.name}
          </p>

          {isRead && (
            <div className="absolute left-0 top-0 w-0.5 h-full bg-primary-500"></div>
          )}
        </a>
      </Link>
    );
  };

  return (
    <React.Fragment>
      <div className="flex justify-end w-full mx-auto mb-8">
        <div className="flex flex-col md:flex-row items-center gap-2">
          <div className="flex items-center gap-2">
            <label htmlFor="source-selector" className="font-medium">
              Sources:{" "}
            </label>

            <Select
              id="source-selector"
              options={[
                {
                  label: "Verified",
                  options: sourcesToOptions(Object.keys(verifiedSources)),
                },
                {
                  label: "Not verified",
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

          <Select
            value={activeChunkOption}
            options={chunkOptions}
            className="ml-auto"
            isClearable={false}
            defaultValue={activeChunkOption}
            onChange={({ value }) => {
              setActiveChunk(value);
            }}
          />
        </div>
      </div>

      <div className="space-y-2 overflow-hidden">
        {readData?.chapter && (
          <div className="flex items-center gap-4">
            <p className="shrink-0">Continue reading: </p>

            <div className="w-full">{onEachChapter(readData.chapter)}</div>
          </div>
        )}

        {activeChunk.map(onEachChapter)}
      </div>
    </React.Fragment>
  );
};

export default ChapterSelector;
