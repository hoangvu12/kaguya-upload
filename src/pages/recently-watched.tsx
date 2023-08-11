import Card from "@/components/shared/Card";
import Head from "@/components/shared/Head";
import List from "@/components/shared/List";
import Section from "@/components/shared/Section";
import ListSkeleton from "@/components/skeletons/ListSkeleton";
import useWatched from "@/hooks/useWatched";
import { useTranslation } from "next-i18next";
import React from "react";

const RecentlyWatchedPage = () => {
  const { data, isLoading } = useWatched(0);
  const { t } = useTranslation("common");

  return (
    <Section className="py-20">
      <Head
        title={`Recently watched - Kaguya`}
        description={`Your recently watched data in Kaguya`}
      />

      <h1 className="text-4xl font-semibold mb-8">
        {t("anime_home:recently_watched")}
      </h1>

      {isLoading ? (
        <ListSkeleton />
      ) : data?.length ? (
        <List data={data}>{(data) => <Card data={data.media} />}</List>
      ) : (
        <p className="mt-8 text-2xl text-center">{t("no_list_results")}</p>
      )}
    </Section>
  );
};

export default RecentlyWatchedPage;
