import CardSwiper from "@/components/shared/CardSwiper";
import Section from "@/components/shared/Section";
import ListSwiperSkeleton from "@/components/skeletons/ListSwiperSkeleton";
import useMangaRecommendedList from "@/hooks/useMangaRecommendedList";
import { ReadChaptersWithMedia } from "@/hooks/useRead";
import { getTitle } from "@/utils/data";
import { useTranslation } from "next-i18next";
import React from "react";

const composeData = (data: ReadChaptersWithMedia) => {
  const title = getTitle(data.media);

  const recommendations = data.media?.recommendations?.nodes.map((node) => {
    return node.mediaRecommendation;
  });

  return {
    title,
    list: recommendations,
  };
};

const RecommendedMangaSection = () => {
  const { data, isError, isLoading } = useMangaRecommendedList();
  const { t } = useTranslation("manga_home");

  if (isLoading) {
    return <ListSwiperSkeleton />;
  }

  if (!data || isError) {
    return null;
  }

  const composedData = composeData(data);

  return composedData?.list?.length ? (
    <Section title={`${t("because_you_read")} "${composedData.title}"`}>
      <CardSwiper data={composedData.list} />
    </Section>
  ) : null;
};

export default React.memo(RecommendedMangaSection);
