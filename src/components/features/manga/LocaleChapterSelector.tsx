import locales from "@/locales.json";
import classNames from "classnames";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import ChapterSelector, { ChapterSelectorProps } from "./ChapterSelector";

interface LocaleChapterSelectorProps extends ChapterSelectorProps {}

const LocaleChapterSelector: React.FC<LocaleChapterSelectorProps> = ({
  chapters,
  readData,
  ...props
}) => {
  const router = useRouter();
  const { t } = useTranslation("common");

  const defaultTabIndex = useMemo(() => {
    let activeLocale = router.locale;

    const chooseLocale = (locales: string[]) => {
      // Locales doesn't contains current locale => choose the first locale.
      if (!locales?.includes(router.locale)) {
        return locales[0];
      }

      return router.locale;
    };

    const readChapterLocales = readData?.chapter?.source?.locales;

    if (readChapterLocales?.length) {
      activeLocale = chooseLocale(readChapterLocales);
    }

    return locales.findIndex(({ locale }) => locale === activeLocale);
  }, [router.locale, readData?.chapter?.source?.locales]);

  const localesHasChapters = useMemo(() => {
    return locales.filter((locale) =>
      chapters?.some((chapter) =>
        chapter?.source?.locales.some(
          (sourceLocale) => sourceLocale === locale.locale
        )
      )
    );
  }, [chapters]);

  return (
    <React.Fragment>
      {localesHasChapters?.length ? (
        <Tabs
          defaultIndex={defaultTabIndex}
          selectedTabClassName="bg-white !text-black"
        >
          <TabList className="flex items-center justify-end gap-x-1">
            {localesHasChapters.map(({ locale }, index) => {
              return (
                <Tab
                  key={index}
                  className={classNames(
                    "px-3 py-2 rounded-[6px] cursor-pointer hover:bg-white hover:text-black transition duration-300"
                  )}
                >
                  {locale.toUpperCase()}
                </Tab>
              );
            })}
          </TabList>

          <div className="mt-4">
            {localesHasChapters.map(({ locale }, index) => {
              const localeChapters = chapters?.filter((chapter) =>
                chapter?.source?.locales.some(
                  (sourceLocale) => sourceLocale === locale
                )
              );

              return (
                <TabPanel key={index}>
                  {!localeChapters?.length ? (
                    <p className="text-center text-2xl">{t("no_chapters")}</p>
                  ) : (
                    <ChapterSelector chapters={localeChapters} {...props} />
                  )}
                </TabPanel>
              );
            })}
          </div>
        </Tabs>
      ) : (
        <p className="text-center text-2xl">{t("no_chapters")}</p>
      )}
    </React.Fragment>
  );
};

export default LocaleChapterSelector;
