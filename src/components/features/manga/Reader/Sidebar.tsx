import ButtonTooltip from "@/components/shared/ButtonTooltip";
import CircleButton from "@/components/shared/CircleButton";
import Input from "@/components/shared/Input";
import Kbd from "@/components/shared/Kbd";
import {
  chaptersAtom,
  currentChapterAtom,
  currentChapterIndexAtom,
  mangaAtom,
  setChapterAtom,
} from "@/contexts/ReadContext";
import {
  isSidebarOpenAtom,
  readPanelStateAtom,
} from "@/contexts/ReadPanelContext";
import {
  directions,
  fitModes,
  useReadSettings,
} from "@/contexts/ReadSettingsContext";
import useHistory from "@/hooks/useHistory";
import { getTitle } from "@/utils/data";
import classNames from "classnames";
import { Variants, motion } from "framer-motion";
import { useAtomValue, useSetAtom } from "jotai";
import { useTranslation } from "next-i18next";
import { useEffect, useMemo, useState } from "react";
import { BrowserView, MobileView, isMobileOnly } from "react-device-detect";
import { AiOutlineSearch } from "react-icons/ai";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { BsArrowLeft } from "react-icons/bs";
import {
  CgArrowDown,
  CgArrowLeft,
  CgArrowRight,
  CgArrowsShrinkH,
  CgArrowsShrinkV,
} from "react-icons/cg";
import { HiOutlineArrowsExpand } from "react-icons/hi";

const sourcesToOptions = (sources: string[]) =>
  sources.map((source) => ({ value: source, label: source }));

const sidebarVariants: Variants = {
  initial: {
    width: 0,
    opacity: 0,
  },
  animate: { width: "25%", opacity: 1 },
};

const mobileSidebarVarants: Variants = {
  initial: {
    y: "-100%",
  },
  animate: { y: 0 },
};

const transition = [0.33, 1, 0.68, 1];

const Sidebar = () => {
  const { back } = useHistory();

  const isSidebarOpen = useAtomValue(isSidebarOpenAtom);
  const setState = useSetAtom(readPanelStateAtom);

  const manga = useAtomValue(mangaAtom);
  const currentChapter = useAtomValue(currentChapterAtom);
  const chapters = useAtomValue(chaptersAtom);
  const currentChapterIndex = useAtomValue(currentChapterIndexAtom);
  const setChapter = useAtomValue(setChapterAtom);

  const { fitMode, setSetting, direction } = useReadSettings();
  const { t } = useTranslation("manga_read");

  const [filterText, setFilterText] = useState("");

  const handleSidebarState = (isOpen: boolean) => () => {
    setState((prev) => ({ ...prev, isSidebarOpen: isOpen }));
  };

  const title = useMemo(() => getTitle(manga), [manga]);

  const filteredChapters = useMemo(() => {
    return chapters.filter(
      (chapter) =>
        chapter?.title?.includes(filterText) ||
        chapter?.number?.includes(filterText)
    );
  }, [filterText, chapters]);

  const handleChangeChapterIndex = (index: number) => () => {
    setChapter(chapters[index]);
  };

  useEffect(() => {
    const currentChapterEl = document.querySelector(".active-chapter");

    if (!currentChapterEl) return;

    currentChapterEl.scrollIntoView();
  }, [currentChapter]);

  return (
    <motion.div
      variants={isMobileOnly ? mobileSidebarVarants : sidebarVariants}
      animate={isSidebarOpen ? "animate" : "initial"}
      initial="initial"
      className={classNames(
        "bg-background-800 flex-shrink-0 flex-grow-0",
        isMobileOnly && "fixed top-0 w-full min-h-[content] z-50"
      )}
      transition={{ ease: transition, duration: 0.6 }}
    >
      <div className="flex flex-col h-full w-full p-4 space-y-2">
        {/* Leave | Open/Close */}
        <div className="flex w-full items-center justify-between">
          <CircleButton
            LeftIcon={BsArrowLeft}
            iconClassName="w-7 h-7"
            secondary
            onClick={back}
          />

          <p className="text-center text-lg font-semibold line-clamp-1">
            {title}
          </p>

          <BrowserView>
            <CircleButton
              LeftIcon={BiChevronLeft}
              iconClassName="w-8 h-8"
              secondary
              onClick={handleSidebarState(false)}
            />
          </BrowserView>
        </div>

        {/* Mobile chapter selector */}
        <div className="flex items-center justify-center md:justify-between space-x-2 md:space-x-0">
          <ButtonTooltip
            tooltip={
              <p>
                {t("previous_chapter")} <Kbd className="ml-2">[</Kbd>
              </p>
            }
            LeftIcon={BiChevronLeft}
            iconClassName="w-8 h-8"
            secondary
            disabled={currentChapterIndex === 0}
            onClick={handleChangeChapterIndex(currentChapterIndex - 1)}
            shortcutKey="["
          />

          <MobileView className="grow">
            <select
              value={currentChapter.id}
              onChange={(e) => {
                const chapterId = e.target.value;
                const chapter = chapters.find(
                  (chapter) => chapter.id === chapterId
                );

                setChapter(chapter);
              }}
              className="rounded-md py-1 px-2 appearance-none w-full bg-background-700"
            >
              {chapters.map((chapter) => (
                <option key={chapter.id} value={chapter.id}>
                  {chapter.number}
                </option>
              ))}
            </select>
          </MobileView>

          <BrowserView>
            <p>{currentChapter.number}</p>
          </BrowserView>

          <ButtonTooltip
            tooltip={
              <p>
                {t("next_chapter")} <Kbd className="ml-2">]</Kbd>
              </p>
            }
            LeftIcon={BiChevronRight}
            iconClassName="w-8 h-8"
            secondary
            disabled={currentChapterIndex === chapters.length - 1}
            onClick={handleChangeChapterIndex(currentChapterIndex + 1)}
            shortcutKey="]"
          />
        </div>

        {/* Options */}
        <div className="flex items-center justify-center space-x-2">
          <ButtonTooltip
            tooltip={
              <p>
                {t("fit_mode")} <Kbd className="ml-2">F</Kbd>
              </p>
            }
            LeftIcon={
              fitMode === "width"
                ? CgArrowsShrinkH
                : fitMode === "height"
                ? CgArrowsShrinkV
                : HiOutlineArrowsExpand
            }
            onClick={() => {
              const index = fitModes.indexOf(fitMode);

              const nextFitMode = fitModes[(index + 1) % fitModes.length];

              setSetting("fitMode", nextFitMode);
            }}
            shortcutKey="F"
          />

          <ButtonTooltip
            tooltip={
              <p>
                {t("layout_direction")} <Kbd className="ml-2">D</Kbd>
              </p>
            }
            LeftIcon={
              direction === "vertical"
                ? CgArrowDown
                : direction === "ltr"
                ? CgArrowRight
                : CgArrowLeft
            }
            onClick={() => {
              const index = directions.indexOf(direction);

              const nextDirection = directions[(index + 1) % directions.length];

              setSetting("direction", nextDirection);
            }}
            shortcutKey="D"
          />
        </div>

        {/* Desktop chapter selector */}
        <BrowserView className="grow space-y-2">
          <Input
            LeftIcon={AiOutlineSearch}
            className="w-full h-6 !bg-background-700"
            containerClassName="!bg-background-700"
            containerInputClassName="!bg-background-700"
            placeholder={t("search_chapter_placeholder")}
            onChange={(e) =>
              setFilterText((e.target as HTMLInputElement).value)
            }
          />
        </BrowserView>

        <BrowserView renderWithFragment>
          <ul className="h-full overflow-auto bg-background-900">
            {filteredChapters.map((chapter) => {
              const isActive = chapter.id === currentChapter.id;

              return (
                <li
                  className={classNames(
                    "relative px-4 py-2 cursor-pointer hover:bg-white/20 transition duration-300",
                    isActive && "active-chapter"
                  )}
                  key={chapter.id}
                  onClick={() => setChapter(chapter)}
                >
                  {chapter.number} {chapter.title && ` - ${chapter.title}`}
                  {isActive && (
                    <div className="absolute left-0 top-0 h-full w-1 bg-primary-500"></div>
                  )}
                </li>
              );
            })}
          </ul>
        </BrowserView>
      </div>
    </motion.div>
  );
};

export default Sidebar;
