import React, { useMemo } from "react";
import SourceEpisodeSelector, {
  SourceEpisodeSelectorProps,
} from "../SourceEpisodeSelector";
import locales from "@/locales.json";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { useRouter } from "next/router";
import classNames from "classnames";
import { useTranslation } from "next-i18next";

interface LocaleEpisodeSelectorProps extends SourceEpisodeSelectorProps {
  className?: string;
}

const LocaleEpisodeSelector: React.FC<LocaleEpisodeSelectorProps> = ({
  episodes,
  className,
  activeEpisode,
  watchedData,
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

    const activeEpisodeLocales = activeEpisode?.source?.locales;
    const watchedEpisodeLocales = watchedData?.episode?.source?.locales;

    if (activeEpisodeLocales?.length) {
      activeLocale = chooseLocale(activeEpisodeLocales);
    } else if (watchedEpisodeLocales?.length) {
      activeLocale = chooseLocale(watchedEpisodeLocales);
    }

    return locales.findIndex(({ locale }) => locale === activeLocale);
  }, [
    activeEpisode?.source?.locales,
    router.locale,
    watchedData?.episode?.source?.locales,
  ]);

  const localesHasEpisodes = useMemo(() => {
    return locales.filter((locale) =>
      episodes?.some((episode) =>
        episode?.source?.locales.some(
          (sourceLocale) => sourceLocale === locale.locale
        )
      )
    );
  }, [episodes]);

  return (
    <React.Fragment>
      {localesHasEpisodes?.length ? (
        <Tabs
          defaultIndex={defaultTabIndex}
          selectedTabClassName="bg-white !text-black"
          className={className}
        >
          <TabList className="flex items-center justify-end gap-x-1">
            {localesHasEpisodes.map(({ locale }) => {
              return (
                <Tab
                  key={locale}
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
            {localesHasEpisodes.map(({ locale }) => {
              const localeEpisodes = episodes?.filter((episode) =>
                episode?.source?.locales.some(
                  (sourceLocale) => sourceLocale === locale
                )
              );

              return (
                <TabPanel key={locale}>
                  {!localeEpisodes?.length ? (
                    <p className="text-center text-2xl">{t("no_episodes")}</p>
                  ) : (
                    <SourceEpisodeSelector
                      key={locale}
                      episodes={localeEpisodes}
                      activeEpisode={activeEpisode}
                      watchedData={watchedData}
                      {...props}
                    />
                  )}
                </TabPanel>
              );
            })}
          </div>
        </Tabs>
      ) : (
        <p className="text-center text-2xl">{t("no_episodes")}</p>
      )}
    </React.Fragment>
  );
};

export default React.memo(LocaleEpisodeSelector);
