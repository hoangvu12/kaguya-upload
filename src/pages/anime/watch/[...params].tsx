import WatchPage from "@/components/features/anime/WatchPage";
import Button from "@/components/shared/Button";
import Head from "@/components/shared/Head";
import Loading from "@/components/shared/Loading";
import { REVALIDATE_TIME } from "@/constants";
import useEpisodes from "@/hooks/useEpisodes";
import useHistory from "@/hooks/useHistory";
import { getMediaDetails } from "@/services/anilist";
import { Media, MediaType } from "@/types/anilist";
import { getDescription, getTitle } from "@/utils/data";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import React, { useMemo } from "react";

interface WatchPageContainerProps {
  media: Media;
  sourceId: string;
}

const WatchPageContainer: NextPage<WatchPageContainerProps> = ({
  media,
  sourceId,
}) => {
  const { data: episodes, isLoading } = useEpisodes(media, sourceId);
  const { back } = useHistory();
  const { t } = useTranslation("anime_watch");

  const title = useMemo(() => getTitle(media), [media]);
  const description = useMemo(() => getDescription(media), [media]);

  const hasEpisodes = useMemo(() => episodes?.length > 0, [episodes]);

  return (
    <React.Fragment>
      <Head
        title={`${title} - Kaguya`}
        description={`${description}. Watch ${title} online for free.`}
        image={media.bannerImage}
      />
      {isLoading ? (
        <div className="flex relative w-full min-h-screen">
          <Loading />
        </div>
      ) : !hasEpisodes ? (
        <div className="flex flex-col items-center absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 space-y-4">
          <p className="text-4xl font-semibold text-center">｡゜(｀Д´)゜｡</p>

          <p className="text-xl text-center">
            {t("error_message", {
              error: t("no_episodes_message"),
            })}
          </p>

          <Button className="w-[max-content]" primary onClick={back}>
            {t("error_goback")}
          </Button>
        </div>
      ) : (
        <WatchPage episodes={episodes} media={media} sourceId={sourceId} />
      )}
    </React.Fragment>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { params },
}) => {
  // /watch/160188/animet/150312
  // /watch/mediaID/sourceId/episodeId

  try {
    const media = await getMediaDetails({
      type: MediaType.Anime,
      id: Number(params[0]),
    });

    if (!media) {
      return { notFound: true, revalidate: REVALIDATE_TIME };
    }

    return {
      props: {
        media,
        sourceId: params[1],
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

// @ts-ignore
WatchPageContainer.getLayout = (page) => page;

export default WatchPageContainer;
