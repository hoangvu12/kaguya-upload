import NativeBanner from "@/components/features/ads/NativeBanner";
import ReadSection from "@/components/features/manga/ReadSection";
import RecommendedMangaSection from "@/components/features/manga/RecommendedMangaSection";
import CardSwiper from "@/components/shared/CardSwiper";
import GenreSwiper from "@/components/shared/GenreSwiper";
import Head from "@/components/shared/Head";
import HomeBanner from "@/components/shared/HomeBanner";
import NewestComments from "@/components/shared/NewestComments";
import Section from "@/components/shared/Section";
import ShouldWatch from "@/components/shared/ShouldWatch";
import ListSwiperSkeleton from "@/components/skeletons/ListSwiperSkeleton";
import useMedia from "@/hooks/useMedia";
import { DeviceSelectors } from "@/types";
import { MediaSort, MediaStatus, MediaType } from "@/types/anilist";
import { randomElement } from "@/utils";
import classNames from "classnames";
import { useTranslation } from "next-i18next";
import { NextPage } from "next/types";
import React, { useMemo } from "react";
import {
  BrowserView,
  getSelectorsByUserAgent,
  MobileOnlyView,
} from "react-device-detect";
import dynamic from "next/dynamic";
import ListSkeleton from "@/components/skeletons/ListSkeleton";
import Card from "@/components/shared/Card";
import List from "@/components/shared/List";

const Banner = dynamic(() => import("@/components/features/ads/Banner"), {
  ssr: false,
});

interface HomeProps {
  selectors: DeviceSelectors;
}

const Home: NextPage<HomeProps> = ({ selectors }) => {
  const { t } = useTranslation();

  const { isMobileOnly } = selectors;

  const { data: trendingManga, isLoading: trendingLoading } = useMedia({
    type: MediaType.Manga,
    sort: [MediaSort.Trending_desc, MediaSort.Popularity_desc],
    perPage: 10,
  });

  const { data: recentlyUpdated, isLoading: recentlyUpdatedLoading } = useMedia(
    {
      type: MediaType.Manga,
      sort: [MediaSort.Updated_at_desc],
      isAdult: false,
      perPage: 10,
    }
  );

  const { data: upcoming, isLoading: upcomingLoading } = useMedia({
    status: MediaStatus.Not_yet_released,
    sort: [MediaSort.Trending_desc],
    perPage: 10,
    type: MediaType.Manga,
  });

  const randomTrendingManga = useMemo(() => {
    return randomElement(trendingManga || []);
  }, [trendingManga]);

  return (
    <React.Fragment>
      <Head
        title="Home (Manga) - Kaguya"
        description="Welcome to our manga website, your ultimate source for the latest manga releases. Here, you can explore the vast world of manga and read your favorite titles online. Our extensive library features a wide range of manga genres, from action and adventure to romance and drama. You can easily search and sort by manga name, author, and genre to find the perfect read. Our website is updated regularly with the latest manga releases, so you'll never miss a beat. Whether you're a long-time manga fan or a newcomer, our website is the perfect destination for all your manga needs. Visit us now and start reading the latest manga releases!"
      />

      <div className="pb-8">
        <HomeBanner
          selectors={selectors}
          data={trendingManga}
          isLoading={trendingLoading}
        />

        <Banner desktop="970x250" mobile="320x100" type="atf" />

        <div className="space-y-8">
          <ReadSection />

          {!isMobileOnly && <RecommendedMangaSection />}

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

            <Section title={t("anime_home:upcoming")}>
              {upcomingLoading ? (
                <ListSwiperSkeleton />
              ) : upcoming?.length ? (
                <List data={upcoming}>{(node) => <Card data={node} />}</List>
              ) : null}
            </Section>
          </MobileOnlyView>

          {!isMobileOnly && <NewestComments type={MediaType.Manga} />}

          {!isMobileOnly && (
            <div
              className={classNames(
                "flex gap-8",
                isMobileOnly ? "flex-col" : "flex-row"
              )}
            >
              <Section
                title={t("manga_home:should_read_today")}
                className="w-full md:w-[80%] md:!pr-0"
              >
                {randomTrendingManga && (
                  <ShouldWatch
                    data={randomTrendingManga}
                    isLoading={!randomTrendingManga}
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

          <Section>
            <NativeBanner />
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
