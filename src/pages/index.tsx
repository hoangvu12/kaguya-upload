import AnimeSchedule from "@/components/features/anime/AiringSchedule";
import RecommendedAnimeSection from "@/components/features/anime/RecommendedAnimeSection";
import WatchedSection from "@/components/features/anime/WatchedSection";
import Card from "@/components/shared/Card";
import CardSwiper from "@/components/shared/CardSwiper";
import GenreSwiper from "@/components/shared/GenreSwiper";
import Head from "@/components/shared/Head";
import HomeBanner from "@/components/shared/HomeBanner";
import List from "@/components/shared/List";
import Section from "@/components/shared/Section";
import ShouldWatch from "@/components/shared/ShouldWatch";
import ListSkeleton from "@/components/skeletons/ListSkeleton";
import ListSwiperSkeleton from "@/components/skeletons/ListSwiperSkeleton";
import useMedia from "@/hooks/useMedia";
import useRecentlyUpdated from "@/hooks/useRecentlyUpdated";
import { DeviceSelectors } from "@/types";
import { MediaSort, MediaStatus, MediaType } from "@/types/anilist";
import { randomElement } from "@/utils";
import classNames from "classnames";
import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import React, { useMemo } from "react";
import {
  BrowserView,
  MobileOnlyView,
  getSelectorsByUserAgent,
} from "react-device-detect";

interface HomeProps {
  selectors: DeviceSelectors;
}

const Home: NextPage<HomeProps> = ({ selectors }) => {
  const { t } = useTranslation();

  const { isMobileOnly } = selectors;

  const { data: trendingAnime, isLoading: trendingLoading } = useMedia({
    type: MediaType.Anime,
    sort: [MediaSort.Trending_desc, MediaSort.Popularity_desc],
    perPage: 10,
  });

  const { data: recentlyUpdated, isLoading: recentlyUpdatedLoading } =
    useRecentlyUpdated();

  const { data: upcoming, isLoading: upcomingLoading } = useMedia(
    {
      status: MediaStatus.Not_yet_released,
      sort: [MediaSort.Trending_desc],
      perPage: 10,
      type: MediaType.Anime,
    },
    {
      enabled: !isMobileOnly,
    }
  );

  const randomTrendingAnime = useMemo(() => {
    return randomElement(trendingAnime || []);
  }, [trendingAnime]);

  return (
    <React.Fragment>
      <Head title="Home (Anime) - Kaguya" />

      <div className="pb-8">
        <HomeBanner
          selectors={selectors}
          data={trendingAnime}
          isLoading={trendingLoading}
        />

        <div className="space-y-8">
          <WatchedSection />

          {!isMobileOnly && <RecommendedAnimeSection />}

          <BrowserView renderWithFragment>
            {recentlyUpdatedLoading ? (
              <ListSwiperSkeleton />
            ) : recentlyUpdated?.length ? (
              <Section title={t("common:newly_added")}>
                <CardSwiper data={recentlyUpdated} />
              </Section>
            ) : null}

            {upcomingLoading ? (
              <ListSwiperSkeleton />
            ) : upcoming?.length ? (
              <Section title={t("anime_home:upcoming")}>
                <CardSwiper data={upcoming} />
              </Section>
            ) : null}
          </BrowserView>

          <MobileOnlyView renderWithFragment>
            <Section title={t("common:newly_added")}>
              {recentlyUpdatedLoading ? (
                <ListSkeleton numOfItems={10} />
              ) : recentlyUpdated?.length ? (
                <List data={recentlyUpdated}>
                  {(node) => <Card data={node} />}
                </List>
              ) : null}
            </Section>
          </MobileOnlyView>

          {!isMobileOnly && (
            <div
              className={classNames(
                "flex gap-8",
                isMobileOnly ? "flex-col" : "flex-row"
              )}
            >
              <Section
                title={t("anime_home:should_watch_today")}
                className="w-full md:w-[80%] md:!pr-0"
              >
                {randomTrendingAnime && (
                  <ShouldWatch
                    data={randomTrendingAnime}
                    isLoading={!randomTrendingAnime}
                  />
                )}
              </Section>

              <Section
                title={t("common:genres")}
                className="w-full md:w-[20%] md:!pl-0"
              >
                <GenreSwiper selectors={selectors} className="md:h-[500px]" />
              </Section>
            </div>
          )}

          <Section title={t("anime_home:airing_schedule")}>
            <AnimeSchedule />
          </Section>
        </div>
      </div>
    </React.Fragment>
  );
};

Home.getInitialProps = async ({ req }) => {
  const userAgent = req ? req.headers["user-agent"] : navigator.userAgent;

  const selectors = getSelectorsByUserAgent(userAgent);

  return {
    selectors,
  };
};

export default Home;
