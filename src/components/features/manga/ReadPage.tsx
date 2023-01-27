import ReadContainer from "@/components/features/manga/Reader/ReadContainer";
import Button from "@/components/shared/Button";
import Head from "@/components/shared/Head";
import Loading from "@/components/shared/Loading";
import Portal from "@/components/shared/Portal";
import { ReadContextProvider } from "@/contexts/ReadContext";
import { ReadSettingsContextProvider } from "@/contexts/ReadSettingsContext";
import useFetchImages from "@/hooks/useFetchImages";
import useSavedRead from "@/hooks/useSavedRead";
import useSaveRead from "@/hooks/useSaveRead";
import { Chapter } from "@/types";
import { Media } from "@/types/anilist";
import { getDescription, getTitle, sortMediaUnit } from "@/utils/data";
import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";

const ReadPanel = dynamic(
  () => import("@/components/features/manga/Reader/ReadPanel"),
  {
    ssr: false,
  }
);

interface ReadPageProps {
  chapters: Chapter[];
  media: Media;
}

const ReadPage: NextPage<ReadPageProps> = ({ chapters, media: manga }) => {
  const router = useRouter();
  const [showReadOverlay, setShowReadOverlay] = useState(false);
  const [declinedReread, setDeclinedReread] = useState(false);
  const saveReadTimeout = useRef<NodeJS.Timeout>();
  const { locale } = useRouter();
  const { t } = useTranslation("manga_read");
  const saveReadMutation = useSaveRead();

  const sortedChapters = useMemo(() => sortMediaUnit(chapters), [chapters]);

  const { params } = router.query;

  const [
    mangaId,
    sourceId = chapters[0].sourceId,
    chapterId = chapters[0].sourceChapterId,
  ] = params as string[];

  const {
    data: savedReadData,
    isLoading: isSavedDataLoading,
    isError: isSavedDataError,
  } = useSavedRead(Number(mangaId));

  const title = useMemo(() => getTitle(manga, locale), [manga, locale]);
  const description = useMemo(
    () => getDescription(manga, locale),
    [manga, locale]
  );

  const sourceChapters = useMemo(
    () => sortedChapters.filter((chapter) => chapter.sourceId === sourceId),
    [sortedChapters, sourceId]
  );

  const currentChapter = useMemo(() => {
    const chapter = sourceChapters.find(
      (chapter) => chapter.sourceChapterId === chapterId
    );

    if (!chapter) {
      toast.error(
        "The requested chapter was not found. It's either deleted or doesn't exist."
      );

      return sourceChapters[0] || chapters[0];
    }

    return chapter;
  }, [sourceChapters, chapterId, chapters]);

  const currentChapterIndex = useMemo(
    () =>
      sourceChapters.findIndex(
        (chapter) => chapter.sourceChapterId === chapterId
      ),
    [sourceChapters, chapterId]
  );

  const nextChapter = useMemo(
    () => sourceChapters[Number(currentChapterIndex) + 1],
    [currentChapterIndex, sourceChapters]
  );

  const readChapter = useMemo(
    () =>
      isSavedDataError
        ? null
        : chapters.find(
            (chapter) =>
              chapter.sourceChapterId ===
                savedReadData?.chapter.sourceChapterId &&
              chapter.sourceId === savedReadData?.chapter.sourceId
          ),
    [chapters, savedReadData, isSavedDataError]
  );

  const { data, isError, error, isLoading } = useFetchImages(
    currentChapter,
    nextChapter
  );

  const handleChapterNavigate = useCallback(
    (chapter: Chapter) => {
      router.replace(
        `/manga/read/${mangaId}/${chapter.sourceId}/${chapter.sourceChapterId}`,
        null,
        {
          shallow: true,
        }
      );
    },
    [mangaId, router]
  );

  useEffect(() => {
    if (
      !readChapter ||
      isSavedDataLoading ||
      isSavedDataError ||
      declinedReread
    )
      return;

    if (currentChapter.chapterNumber >= readChapter?.chapterNumber) {
      setDeclinedReread(true);

      return;
    }

    setShowReadOverlay(true);
  }, [
    currentChapter?.chapterNumber,
    currentChapter?.sourceChapterId,
    declinedReread,
    isSavedDataError,
    isSavedDataLoading,
    readChapter,
  ]);

  useEffect(() => {
    if (saveReadTimeout.current) {
      clearTimeout(saveReadTimeout.current);
    }

    saveReadTimeout.current = setTimeout(
      () =>
        saveReadMutation.mutate({
          chapter_id: `${currentChapter.source.id}-${currentChapter.sourceChapterId}`,
          media_id: Number(mangaId),
        }),
      10000
    );

    return () => {
      clearTimeout(saveReadTimeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChapter, mangaId]);

  return (
    <ReadContextProvider
      value={{
        manga: manga,
        currentChapter,
        currentChapterIndex,
        chapters,
        setChapter: handleChapterNavigate,
        sourceId,
        images: data?.images,
      }}
    >
      <ReadSettingsContextProvider>
        <div className="fixed inset-0 flex items-center justify-center w-full min-h-screen">
          <Head
            title={`${title} (${currentChapter.name}) - Kaguya`}
            description={`${description} - ${t("head_description", {
              title,
              chapterName: currentChapter.name,
            })}`}
            image={manga.bannerImage || manga.coverImage.extraLarge}
          />

          <ReadPanel>
            {isError ? (
              <div className="w-full h-full flex flex-col items-center justify-center space-y-8">
                <div className="space-y-4 text-center">
                  <p className="text-4xl font-semibold">｡゜(｀Д´)゜｡</p>
                  <p className="text-xl">
                    {t("error_message", {
                      error: error?.response?.data?.error || error.message,
                    })}
                  </p>

                  <p className="text-lg">{t("error_fallback_suggest")}</p>
                </div>
              </div>
            ) : !isLoading ? (
              <ReadContainer />
            ) : (
              <Loading />
            )}
          </ReadPanel>

          {showReadOverlay && !declinedReread && (
            <Portal>
              <div
                className="fixed inset-0 z-40 bg-black/70"
                onClick={() => {
                  setShowReadOverlay(false);
                  setDeclinedReread(true);
                }}
              />

              <div className="fixed left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 z-50 w-11/12 lg:w-2/3 p-8 rounded-md bg-background-900">
                <h1 className="text-4xl font-bold mb-4">
                  {t("reread_heading", { chapterName: readChapter.name })}
                </h1>
                <p>
                  {t("reread_description", { chapterName: readChapter.name })}
                </p>
                <p className="mb-4">
                  {t("reread_question", { chapterName: readChapter.name })}
                </p>
                <div className="flex items-center justify-end space-x-4">
                  <Button
                    onClick={() => {
                      setShowReadOverlay(false), setDeclinedReread(true);
                    }}
                    className="!bg-transparent hover:!bg-white/20 transition duration-300"
                  >
                    <p>{t("reread_no")}</p>
                  </Button>
                  <Button
                    onClick={() => {
                      if (!readChapter || isSavedDataLoading) return;

                      const chapter = chapters.find(
                        (chapter) =>
                          chapter.sourceChapterId ===
                            readChapter.sourceChapterId &&
                          chapter.sourceId === readChapter.sourceId
                      );

                      handleChapterNavigate(chapter);
                    }}
                    primary
                  >
                    <p>{t("reread_yes")}</p>
                  </Button>
                </div>
              </div>
            </Portal>
          )}
        </div>
      </ReadSettingsContextProvider>
    </ReadContextProvider>
  );
};

export default ReadPage;
