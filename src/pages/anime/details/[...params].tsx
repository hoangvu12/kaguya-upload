import SourceEpisodeSelector from "@/components/features/anime/SourceEpisodeSelector";
import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";
import CharacterConnectionCard from "@/components/shared/CharacterConnectionCard";
import ClientOnly from "@/components/shared/ClientOnly";
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
import Time from "@/components/shared/Time";
import { titleTypeAtom } from "@/components/shared/TitleSwitcher";
import { REVALIDATE_TIME } from "@/constants";
import withRedirect from "@/hocs/withRedirect";
import dayjs from "@/lib/dayjs";
import { getMediaDetails } from "@/services/anilist";
import { Media, MediaStatus, MediaType } from "@/types/anilist";
import {
  createStudioDetailsUrl,
  numberWithCommas,
  stringToSlug,
} from "@/utils";
import { convert, getDescription, getTitle } from "@/utils/data";
import { useAtomValue } from "jotai";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef } from "react";
import { isMobileOnly } from "react-device-detect";
import { BsFillPlayFill } from "react-icons/bs";
import { toast } from "react-toastify";

interface DetailsPageProps {
  anime: Media;
}

const DetailsPage: NextPage<DetailsPageProps> = ({ anime }) => {
  const { locale } = useRouter();
  const { t } = useTranslation("anime_details");
  const episodeSelectorRef = useRef<HTMLDivElement>(null);

  const nextAiringSchedule = useMemo(
    () =>
      anime?.airingSchedule?.nodes
        ?.sort((a, b) => a.episode - b.episode)
        .find((schedule) => dayjs.unix(schedule.airingAt).isAfter(dayjs())),
    [anime?.airingSchedule]
  );

  const titleType = useAtomValue(titleTypeAtom);

  const title = useMemo(
    () => getTitle(anime, { titleType, locale }),
    [anime, titleType, locale]
  );
  const description = useMemo(
    () => getDescription(anime, { locale }),
    [anime, locale]
  );

  const handleWatchClick = () => {
    if (anime.status === MediaStatus.Not_yet_released) {
      toast.error("This anime hasn't been released yet");
      return;
    }

    episodeSelectorRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  useEffect(() => {
    if (!anime) return;

    const syncDataScript = document.querySelector("#syncData");

    syncDataScript.textContent = JSON.stringify({
      title: anime.title.userPreferred,
      aniId: Number(anime.id),
      episode: null,
      id: anime.id,
      nextEpUrl: null,
    });
  }, [anime]);

  return (
    <>
      <Head
        title={`${title} - Kaguya`}
        description={description}
        image={anime.bannerImage}
      />

      <div className="pb-8">
        <DetailsBanner image={anime.bannerImage}></DetailsBanner>

        <Section className="relative pb-4 bg-background-900">
          <div className="flex flex-row md:space-x-8">
            <div className="shrink-0 relative md:static md:left-0 md:-translate-x-0 w-[120px] md:w-[186px] mt-4 md:-mt-12 space-y-6">
              <PlainCard src={anime.coverImage.extraLarge} alt={title} />
            </div>

            <div className="flex flex-col justify-between md:py-4 ml-4 text-left items-start md:-mt-16 space-y-4">
              <div className="flex flex-col items-start space-y-4 md:no-scrollbar">
                <div className="hidden md:flex items-center flex-wrap gap-2 mb-4">
                  <Button
                    onClick={handleWatchClick}
                    primary
                    LeftIcon={BsFillPlayFill}
                  >
                    <p>{t("common:watch_now")}</p>
                  </Button>
                </div>

                <p className="mb-2 text-2xl md:text-3xl font-semibold">
                  {title}
                </p>

                <DotList>
                  {anime.genres.map((genre) => (
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
                  value={convert(anime.countryOfOrigin, "country", { locale })}
                />
                <InfoItem
                  title={t("common:total_episodes")}
                  value={anime.episodes}
                />

                {anime.duration && (
                  <InfoItem
                    title={t("common:duration")}
                    value={`${anime.duration} ${t("common:minutes")}`}
                  />
                )}

                <InfoItem
                  title={t("common:status")}
                  value={convert(anime.status, "status", { locale })}
                />
                <InfoItem
                  title={t("common:age_rated")}
                  value={anime.isAdult ? "18+" : ""}
                />

                {nextAiringSchedule && (
                  <Time time={nextAiringSchedule.airingAt}>
                    {(timestamp) => {
                      const time = new Date(timestamp * 1000);
                      const seconds = time.getSeconds();
                      const minutes = time.getMinutes();
                      const hours = time.getHours();
                      const days = Math.floor(timestamp / (24 * 60 * 60));

                      return (
                        <InfoItem
                          className="!text-primary-300"
                          title={t("next_airing_schedule")}
                          value={`${t("common:episode")} ${
                            nextAiringSchedule.episode
                          }: ${days}d ${hours}h ${minutes}m ${seconds}s`}
                        />
                      );
                    }}
                  </Time>
                )}
              </div>
            </div>
          </div>

          <MediaDescription
            description={description}
            containerClassName="my-4 block md:hidden"
            className="text-gray-300 hover:text-gray-100 transition duration-300"
          />

          <div className="flex md:hidden items-center space-x-2 mb-4">
            <div className="flex-1">
              <Button
                onClick={handleWatchClick}
                primary
                LeftIcon={BsFillPlayFill}
                className="relative w-full"
              >
                <p className="!mx-0 absolute left-1/2 -translate-x-1/2">
                  {t("common:watch_now")}
                </p>
              </Button>
            </div>
          </div>

          <div className="md:hidden flex gap-x-8 overflow-x-auto md:gap-x-16 [&>*]:shrink-0">
            <InfoItem
              title={t("common:country")}
              value={convert(anime.countryOfOrigin, "country", { locale })}
            />
            <InfoItem
              title={t("common:total_episodes")}
              value={anime.episodes}
            />

            {anime.duration && (
              <InfoItem
                title={t("common:duration")}
                value={`${anime.duration} ${t("common:minutes")}`}
              />
            )}

            <InfoItem
              title={t("common:status")}
              value={convert(anime.status, "status", { locale })}
            />
            <InfoItem
              title={t("common:age_rated")}
              value={anime.isAdult ? "18+" : ""}
            />
          </div>
        </Section>

        <Section className="w-full min-h-screen gap-8 mt-2 md:mt-8 space-y-8 md:space-y-0 md:grid md:grid-cols-10 sm:px-12">
          <div className="md:col-span-2 xl:h-[max-content] space-y-4">
            <div className="flex flex-row md:flex-col overflow-x-auto bg-background-900 rounded-md md:p-4 gap-4 [&>*]:shrink-0 md:no-scrollbar">
              <InfoItem
                title={t("common:format")}
                value={convert(anime.format, "format", { locale })}
              />
              <InfoItem title="English" value={anime.title.english} />
              <InfoItem title="Native" value={anime.title.native} />
              <InfoItem title="Romanji" value={anime.title.romaji} />
              <InfoItem
                title={t("common:popular")}
                value={numberWithCommas(anime.popularity)}
              />
              <InfoItem
                title={t("common:favourite")}
                value={numberWithCommas(anime.favourites)}
              />
              <InfoItem
                title={t("common:trending")}
                value={numberWithCommas(anime.trending)}
              />

              <InfoItem
                title="Studio"
                value={anime.studios.nodes.map((studio) => (
                  <p key={studio.id}>
                    <Link href={createStudioDetailsUrl(studio)}>
                      <a className="hover:text-primary-300 transition duration-300">
                        {studio.name}
                      </a>
                    </Link>
                  </p>
                ))}
              />

              <InfoItem
                title={t("common:season")}
                value={`${convert(anime.season, "season", { locale })} ${
                  anime.seasonYear
                }`}
              />
              <InfoItem
                title={t("common:synonyms")}
                value={anime.synonyms.map((synomym) => (
                  <p key={synomym}>{synomym}</p>
                ))}
              />
            </div>

            <div className="space-y-2 text-gray-400">
              <h1 className="font-semibold">Tags</h1>

              <ul className="overflow-x-auto flex flex-row md:flex-col gap-2 [&>*]:shrink-0 md:no-scrollbar">
                {anime.tags.map((tag) => (
                  <Link
                    href={{
                      pathname: "/browse",
                      query: { type: "anime", tags: tag.name },
                    }}
                    key={tag.id}
                  >
                    <a className="md:block">
                      <li className="p-2 rounded-md bg-background-900 hover:text-primary-300 transition duration-300">
                        {tag.name}
                      </li>
                    </a>
                  </Link>
                ))}
              </ul>
            </div>
          </div>

          {nextAiringSchedule?.airingAt && isMobileOnly && (
            <ClientOnly>
              <div className="flex flex-col items-center justify-center">
                <p className="uppercase text-gray-100 text-lg">
                  Episode {nextAiringSchedule.episode} will be released in
                </p>

                <p className="text-center text-lg uppercase font-semibold">
                  <Time time={nextAiringSchedule.airingAt}>
                    {(timestamp) => {
                      const time = new Date(timestamp * 1000);
                      const seconds = time.getSeconds();
                      const minutes = time.getMinutes();
                      const hours = time.getHours();
                      const days = Math.floor(timestamp / (24 * 60 * 60));

                      return (
                        <p>
                          {days}D {hours}H {minutes}M {seconds}S
                        </p>
                      );
                    }}
                  </Time>
                </p>
              </div>
            </ClientOnly>
          )}

          <div className="space-y-12 md:col-span-8">
            <DetailsSection
              title={t("episodes_section")}
              className="overflow-hidden"
            >
              <div ref={episodeSelectorRef}>
                {typeof window !== "undefined" ? (
                  !window?.__kaguya__?.extId ? (
                    <ExtensionInstallAlert />
                  ) : (
                    <SourceEpisodeSelector media={anime} />
                  )
                ) : null}
              </div>
            </DetailsSection>

            {!!anime?.characters?.edges?.length && (
              <DetailsSection
                title={t("characters_section")}
                className="grid w-full grid-cols-1 gap-4 md:grid-cols-2"
              >
                {anime.characters.edges.map((characterEdge, index) => (
                  <CharacterConnectionCard
                    characterEdge={characterEdge}
                    key={index}
                  />
                ))}
              </DetailsSection>
            )}

            {!!anime?.relations?.nodes?.length && (
              <DetailsSection title={t("relations_section")}>
                <List data={anime.relations.nodes.filter(Boolean)}>
                  {(node) => <Card data={node} showType />}
                </List>
              </DetailsSection>
            )}

            {!!anime?.recommendations?.nodes?.length && (
              <DetailsSection title={t("recommendations_section")}>
                <List
                  data={anime.recommendations.nodes
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
      type: MediaType.Anime,
      id: Number(params[0]),
    });

    return {
      props: {
        anime: media as Media,
      },
      revalidate: REVALIDATE_TIME,
    };
  } catch (err) {
    console.log(err);

    return { notFound: true, revalidate: REVALIDATE_TIME };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: "blocking" };
};

export default withRedirect(DetailsPage, (router, props) => {
  const { params } = router.query;
  const [id, slug] = params as string[];
  const title = getTitle(props.anime);

  if (slug) return null;

  return {
    url: `/anime/details/${id}/${stringToSlug(title)}`,
    options: {
      shallow: true,
    },
  };
});
