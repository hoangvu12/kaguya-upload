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
  ...props
}) => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const defaultTabIndex = useMemo(
    () => locales.findIndex(({ locale }) => locale === router.locale),
    [router.locale]
  );

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
