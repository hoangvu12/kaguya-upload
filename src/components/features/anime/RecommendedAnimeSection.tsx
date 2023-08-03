import CardSwiper from "@/components/shared/CardSwiper";
import Section from "@/components/shared/Section";
import { TitleType, titleTypeAtom } from "@/components/shared/TitleSwitcher";
import ListSwiperSkeleton from "@/components/skeletons/ListSwiperSkeleton";
import useAnimeRecommendedList from "@/hooks/useAnimeRecommendedList";
import { WatchedEpisodesWithMedia } from "@/hooks/useWatched";
import { getTitle } from "@/utils/data";
import { useAtomValue } from "jotai";
import { useTranslation } from "next-i18next";
import React from "react";

const composeData = (data: WatchedEpisodesWithMedia, titleType: TitleType) => {
  const title = getTitle(data.media, titleType);

  const recommendations = data.media?.recommendations?.nodes.map((node) => {
    return node.mediaRecommendation;
  });

  return {
    title,
    list: recommendations,
  };
};

const RecommendedAnimeSection = () => {
  const { data, isError, isLoading } = useAnimeRecommendedList();
  const { t } = useTranslation("anime_home");
  const titleType = useAtomValue(titleTypeAtom);

  if (isLoading) {
    return <ListSwiperSkeleton />;
  }

  if (!data || isError) {
    return null;
  }

  const composedData = composeData(data, titleType);

  return composedData?.list?.length ? (
    <Section title={`${t("because_you_watched")} "${composedData.title}"`}>
      <CardSwiper data={composedData.list} />
    </Section>
  ) : null;
};

export default React.memo(RecommendedAnimeSection);
