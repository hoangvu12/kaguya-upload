import ReadContainer from "@/components/features/manga/Reader/ReadContainer";
import Button from "@/components/shared/Button";
import Head from "@/components/shared/Head";
import Loading from "@/components/shared/Loading";
import Portal from "@/components/shared/Portal";
import { titleTypeAtom } from "@/components/shared/TitleSwitcher";
import { ReadContextProvider } from "@/contexts/ReadContext";
import { ReadSettingsContextProvider } from "@/contexts/ReadSettingsContext";
import useFetchImages from "@/hooks/useFetchImages";
import useReadChapter from "@/hooks/useReadChapter";
import useSaveReadData from "@/hooks/useSaveReadData";
import { Media } from "@/types/anilist";
import { Chapter } from "@/types/core";
import { parseNumberFromString } from "@/utils";
import { getDescription, getTitle, sortMediaUnit } from "@/utils/data";
import { useAtomValue } from "jotai";
import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  sourceId: string;
}

const ReadPage: NextPage<ReadPageProps> = ({
  chapters,
  media: manga,
  sourceId,
}) => {
  const router = useRouter();
  const [showReadOverlay, setShowReadOverlay] = useState(false);
  const [declinedReread, setDeclinedReread] = useState(false);
  const saveReadTimeout = useRef<NodeJS.Timeout>();
  const { t } = useTranslation("manga_read");

  const sortedChapters = useMemo(() => sortMediaUnit(chapters), [chapters]);

  const { params } = router.query;

  const [mangaId, _, chapterId = sortedChapters[0].id] = params as string[];

  const saveReadMutation = useSaveReadData();

  const {
    data: savedReadData,
    isLoading: isSavedDataLoading,
    isError: isSavedDataError,
  } = useReadChapter(Number(mangaId));

  const titleType = useAtomValue(titleTypeAtom);

  const title = useMemo(
    () => getTitle(manga, { titleType, locale: router.locale }),
    [manga, titleType, router.locale]
  );
  const description = useMemo(
    () => getDescription(manga, { locale: router.locale }),
    [manga, router.locale]
  );

  const currentChapter = useMemo(() => {
    const chapter = chapters.find((chapter) => chapter.id === chapterId);

    if (!chapter) {
      toast.error(
        "The requested chapter was not found. It's either deleted or doesn't exist."
      );

      return chapters[0] || chapters[0];
    }

    return chapter;
  }, [chapters, chapterId]);

  const sectionChapters = useMemo(() => {
    return chapters.filter(
      (chapter) => chapter.section === currentChapter.section
    );
  }, [chapters, currentChapter.section]);

  const currentChapterIndex = useMemo(
    () => sectionChapters.findIndex((chapter) => chapter.id === chapterId),
    [sectionChapters, chapterId]
  );

  const readChapter = useMemo(
    () =>
      isSavedDataError
        ? null
        : chapters.find((chapter) => chapter.id === savedReadData?.chapter.id),
    [chapters, savedReadData, isSavedDataError]
  );

  const { data, isError, error, isLoading } = useFetchImages(
    currentChapter,
    sourceId
  );

  const handleChapterNavigate = useCallback(
    (chapter: Chapter) => {
      router.replace(`/manga/read/${mangaId}/${sourceId}/${chapter.id}`, null, {
        shallow: true,
      });
    },
    [mangaId, router, sourceId]
  );

  useEffect(() => {
    if (
      !readChapter ||
      isSavedDataLoading ||
      isSavedDataError ||
      declinedReread
    )
      return;

    const currentChapterNumber = parseNumberFromString(currentChapter.number);
    const readChapterNumber = parseNumberFromString(readChapter?.number);

    if (currentChapterNumber >= readChapterNumber) {
      setDeclinedReread(true);

      return;
    }

    setShowReadOverlay(true);
  }, [
    currentChapter.number,
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
          chapter: currentChapter,
          mediaId: Number(mangaId),
          sourceId,
        }),
      10000
    );

    return () => {
      clearTimeout(saveReadTimeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChapter, mangaId, sourceId]);

  return (
    <React.Fragment>
      <ReadContextProvider
        value={{
          manga: manga,
          currentChapter,
          currentChapterIndex,
          chapters,
          setChapter: handleChapterNavigate,
          sourceId,
          images: data,
        }}
      />

      <ReadSettingsContextProvider />

      <div className="fixed inset-0 flex items-center justify-center w-full min-h-screen">
        <Head
          title={`${title} (${currentChapter.number}) - Kaguya`}
          description={`${description} - ${t("head_description", {
            title,
            chapterName: currentChapter.number,
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
                    error: error.message,
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
                {t("reread_heading", { chapterName: readChapter.number })}
              </h1>
              <p>
                {t("reread_description", { chapterName: readChapter.number })}
              </p>
              <p className="mb-4">
                {t("reread_question", { chapterName: readChapter.number })}
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
                      (chapter) => chapter.id === readChapter.id
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
    </React.Fragment>
  );
};

export default ReadPage;
