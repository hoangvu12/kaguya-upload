import Card from "@/components/shared/Card";
import CardSwiper from "@/components/shared/CardSwiper";
import List from "@/components/shared/List";
import Section from "@/components/shared/Section";
import ListSwiperSkeleton from "@/components/skeletons/ListSwiperSkeleton";
import useRead from "@/hooks/useRead";
import { useTranslation } from "next-i18next";
import { isMobileOnly } from "react-device-detect";

const ReadSection = () => {
  const { data, isLoading, isError } = useRead();
  const { t } = useTranslation("manga_home");

  if (isLoading) {
    return <ListSwiperSkeleton />;
  }

  if (!data?.length || isError) {
    return null;
  }

  const list = data.map((read) => read.media);

  return (
    <Section title={t("recently_read")}>
      {isMobileOnly ? (
        <List data={list}>{(node) => <Card data={node} key={node.id} />}</List>
      ) : (
        <CardSwiper data={list} />
      )}
    </Section>
  );
};

export default ReadSection;
