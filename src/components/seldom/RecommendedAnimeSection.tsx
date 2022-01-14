import useAnimeRecommendedList from "@/hooks/useAnimeRecommendedList";
import { Watched } from "@/types";
import React from "react";
import ListSwiperSkeleton from "@/components/skeletons/ListSwiperSkeleton";
import CardSwiper from "@/components/shared/CardSwiper";
import Section from "./Section";
import { getTitle } from "@/utils/data";

const composeData = (data: Watched) => {
  const title = getTitle(data.anime);

  const recommendations = data.anime?.recommendations?.map(
    ({ anime }) => anime
  );

  return {
    title,
    list: recommendations,
  };
};

const RecommendedAnimeSection = () => {
  const { data, isError, isLoading } = useAnimeRecommendedList();

  if (isLoading) {
    return <ListSwiperSkeleton />;
  }

  if (!data || isError) {
    return null;
  }

  const composedData = composeData(data);

  return composedData?.list?.length ? (
    <Section title={`Vì bạn đã xem "${composedData.title}"`}>
      <CardSwiper data={composedData.list} type="anime" />
    </Section>
  ) : null;
};

export default React.memo(RecommendedAnimeSection);
