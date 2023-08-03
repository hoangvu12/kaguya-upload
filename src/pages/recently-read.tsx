import Card from "@/components/shared/Card";
import Head from "@/components/shared/Head";
import List from "@/components/shared/List";
import Section from "@/components/shared/Section";
import ListSkeleton from "@/components/skeletons/ListSkeleton";
import useRead from "@/hooks/useRead";
import { useTranslation } from "next-i18next";

const RecentlyWatchedPage = () => {
  const { data, isLoading } = useRead(0);
  const { t } = useTranslation("common");

  return (
    <Section className="py-20">
      <Head
        title={`Recently read - Kaguya`}
        description={`Your recently read data in Kaguya`}
      />

      <h1 className="text-4xl font-semibold mb-8">Recently Read</h1>

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
