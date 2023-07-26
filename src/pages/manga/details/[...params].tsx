import SourceChapterSelector from "@/components/features/manga/SourceChapterSelector";
import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";
import CharacterConnectionCard from "@/components/shared/CharacterConnectionCard";
import DetailsBanner from "@/components/shared/DetailsBanner";
import DetailsSection from "@/components/shared/DetailsSection";
import DotList from "@/components/shared/DotList";
import ExtensionInstallAlert from "@/components/shared/ExtensionInstallAlert";
import Head from "@/components/shared/Head";
import InfoItem from "@/components/shared/InfoItem";
import Link from "@/components/shared/Link";
import List from "@/components/shared/List";
import MediaDescription from "@/components/shared/MediaDescription";
import PlainCard from "@/components/shared/PlainCard";
import Section from "@/components/shared/Section";
import { REVALIDATE_TIME } from "@/constants";
import withRedirect from "@/hocs/withRedirect";
import { getMediaDetails } from "@/services/anilist";
import { Media, MediaStatus, MediaType } from "@/types/anilist";
import { numberWithCommas, stringToSlug } from "@/utils";
import { convert, getDescription, getTitle } from "@/utils/data";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useMemo, useRef } from "react";
import { BsFillPlayFill } from "react-icons/bs";
import { toast } from "react-toastify";

interface DetailsPageProps {
  manga: Media;
}

const DetailsPage: NextPage<DetailsPageProps> = ({ manga }) => {
  const { locale } = useRouter();
  const { t } = useTranslation("manga_details");
  // const { data: chapters, isLoading } = useChapters(manga.id);
  // const { data: readData, isLoading: readLoading } = useSavedRead(manga.id);
  const chapterSelectorRef = useRef<HTMLDivElement>(null);

  const title = useMemo(() => getTitle(manga), [manga]);
  const description = useMemo(() => getDescription(manga), [manga]);

  const handleReadClick = () => {
    if (manga.status === MediaStatus.Not_yet_released) {
      toast.error("This manga hasn't been released yet");
      return;
    }

    chapterSelectorRef.current.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  return (
    <>
      <Head
        title={`${title} - Kaguya`}
        description={description}
        image={manga.bannerImage}
      />

      <div className="pb-8">
        <DetailsBanner image={manga.bannerImage}></DetailsBanner>

        <Section className="relative z-10 bg-background-900 pb-4">
          <div className="flex md:space-x-8">
            <div className="shrink-0 relative md:static md:left-0 md:-translate-x-0 w-[120px] md:w-[186px] mt-4 md:-mt-12 space-y-6">
              <PlainCard src={manga.coverImage.extraLarge} alt={title} />
            </div>

            <div className="flex flex-col justify-between md:py-4 ml-4 text-left items-start md:-mt-16 space-y-4">
              <div className="flex flex-col items-start space-y-4 md:no-scrollbar">
                <div className="hidden md:flex items-center flex-wrap gap-2 mb-4">
                  <Button
                    onClick={handleReadClick}
                    primary
                    LeftIcon={BsFillPlayFill}
                  >
                    <p>{t("read_now")}</p>
                  </Button>
                </div>

                <p className="text-2xl md:text-3xl font-semibold mb-2">
                  {title}
                </p>

                <DotList>
                  {manga.genres.map((genre) => (
                    <span key={genre}>
                      {convert(genre, "genre", { locale })}
                    </span>
                  ))}
                </DotList>

                <MediaDescription
                  description={description}
                  containerClassName="mt-4 mb-8 hidden md:block"
                  className="text-gray-300 hover:text-gray-100 transition duration-300"
                />

                {/* MAL-Sync UI */}
                <div id="mal-sync" className="hidden md:block"></div>
              </div>

              <div className="hidden md:flex gap-x-8 overflow-x-auto md:gap-x-16 [&>*]:shrink-0">
                <InfoItem
                  title={t("common:country")}
                  value={manga.countryOfOrigin}
                />

                <InfoItem
                  title={t("common:status")}
                  value={convert(manga.status, "status", { locale })}
                />

                <InfoItem title={t("total_chapters")} value={manga.chapters} />

                <InfoItem
                  title={t("common:age_rated")}
                  value={manga.isAdult ? "18+" : ""}
                />
              </div>
            </div>
          </div>

          <MediaDescription
            description={description}
            containerClassName="my-4 block md:hidden"
            className="text-gray-300 hover:text-gray-100 transition duration-300"
          />

          <div className="flex md:hidden items-center space-x-2 mb-4">
            <Link href={`/manga/read/${manga.id}`}>
              <a className="flex-1">
                <Button
                  primary
                  LeftIcon={BsFillPlayFill}
                  className="relative w-full"
                >
                  <p className="!mx-0 absolute left-1/2 -translate-x-1/2">
                    {t("read_now")}
                  </p>
                </Button>
              </a>
            </Link>
          </div>

          <div className="md:hidden flex gap-x-8 overflow-x-auto md:gap-x-16 [&>*]:shrink-0">
            <InfoItem
              title={t("common:country")}
              value={manga.countryOfOrigin}
            />

            <InfoItem
              title={t("common:status")}
              value={convert(manga.status, "status", { locale })}
            />

            <InfoItem title={t("total_chapters")} value={manga.chapters} />

            <InfoItem
              title={t("common:age_rated")}
              value={manga.isAdult ? "18+" : ""}
            />
          </div>
        </Section>

        <Section className="w-full min-h-screen gap-8 mt-2 md:mt-8 space-y-8 md:space-y-0 md:grid md:grid-cols-10 sm:px-12">
          <div className="md:col-span-2 h-[max-content] space-y-4">
            <div className="p-4 flex flex-row md:flex-col overflow-x-auto bg-background-900 rounded-md gap-4 [&>*]:shrink-0 md:no-scrollbar">
              <InfoItem title="English" value={manga.title.english} />
              <InfoItem title="Native" value={manga.title.native} />
              <InfoItem title="Romanji" value={manga.title.romaji} />
              <InfoItem
                title={t("common:popular")}
                value={numberWithCommas(manga.popularity)}
              />
              <InfoItem
                title={t("common:favourite")}
                value={numberWithCommas(manga.favourites)}
              />
              <InfoItem
                title={t("common:trending")}
                value={numberWithCommas(manga.trending)}
              />

              <InfoItem
                title={t("common:synonyms")}
                value={manga.synonyms.join("\n")}
              />
            </div>

            <div className="space-y-2 text-gray-400">
              <h1 className="font-semibold">Tags</h1>

              <ul className="overflow-x-auto flex flex-row md:flex-col gap-2 [&>*]:shrink-0 md:no-scrollbar">
                {manga.tags.map((tag) => (
                  <Link
                    href={{
                      pathname: "/browse",
                      query: { type: "manga", tags: tag.name },
                    }}
                    key={tag.id}
                  >
                    <a className="block">
                      <li className="p-2 rounded-md bg-background-900 hover:text-primary-300 transition duration-300">
                        {tag.name}
                      </li>
                    </a>
                  </Link>
                ))}
              </ul>
            </div>
          </div>

          <div className="md:col-span-8 space-y-12">
            <DetailsSection title={t("chapters_section")} className="relative">
              <div ref={chapterSelectorRef}>
                {typeof window !== "undefined" ? (
                  !window?.__kaguya__?.extId ? (
                    <ExtensionInstallAlert />
                  ) : (
                    <SourceChapterSelector media={manga} />
                  )
                ) : null}
              </div>
            </DetailsSection>

            {!!manga?.characters?.edges.length && (
              <DetailsSection
                title={t("characters_section")}
                className="w-full grid md:grid-cols-2 grid-cols-1 gap-4"
              >
                {manga.characters.edges.map((characterEdge, index) => (
                  <CharacterConnectionCard
                    characterEdge={characterEdge}
                    key={index}
                  />
                ))}
              </DetailsSection>
            )}

            {!!manga?.relations?.nodes?.length && (
              <DetailsSection title={t("relations_section")}>
                <List data={manga.relations.nodes.filter(Boolean)}>
                  {(node) => <Card data={node} showType />}
                </List>
              </DetailsSection>
            )}

            {!!manga?.recommendations?.nodes.length && (
              <DetailsSection title={t("recommendations_section")}>
                <List
                  data={manga.recommendations.nodes
                    .map((node) => node.mediaRecommendation)
                    .filter(Boolean)}
                >
                  {(node) => <Card data={node} />}
                </List>
              </DetailsSection>
            )}
          </div>
        </Section>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { params },
}) => {
  try {
    const media = await getMediaDetails({
      type: MediaType.Manga,
      id: Number(params[0]),
    });

    return {
      props: {
        manga: media as Media,
      },
      revalidate: REVALIDATE_TIME,
    };
  } catch (err) {
    return { notFound: true, revalidate: REVALIDATE_TIME };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: "blocking" };
};

export default withRedirect(DetailsPage, (router, props) => {
  const { params } = router.query;
  const [id, slug] = params as string[];
  const title = getTitle(props.manga);

  if (slug) return null;

  return {
    url: `/manga/details/${id}/${stringToSlug(title)}`,
    options: {
      shallow: true,
    },
  };
});
