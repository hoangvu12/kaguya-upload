import ReadPage from "@/components/features/manga/ReadPage";
import Button from "@/components/shared/Button";
import Head from "@/components/shared/Head";
import Loading from "@/components/shared/Loading";
import { REVALIDATE_TIME } from "@/constants";
import useHistory from "@/hooks/useHistory";
import useChapters from "@/hooks/useChapters";
import { getMediaDetails } from "@/services/anilist";
import { Media, MediaType } from "@/types/anilist";
import { getDescription, getTitle } from "@/utils/data";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import ExtensionInstallAlert from "@/components/shared/ExtensionInstallAlert";

interface ReadPageContainerProps {
  media: Media;
  sourceId: string;
}

const ReadPageContainer: NextPage<ReadPageContainerProps> = ({
  media,
  sourceId,
}) => {
  const { data: chapters, isLoading } = useChapters(media, sourceId);
  const { back } = useHistory();
  const { t } = useTranslation("manga_read");

  const title = useMemo(() => getTitle(media), [media]);
  const description = useMemo(() => getDescription(media), [media]);

  const hasChapters = useMemo(() => chapters?.length > 0, [chapters]);

  return (
    <React.Fragment>
      <Head
        title={`${title} - Kaguya`}
        description={`${description} - ${t("head_description", {
          title,
        })}`}
        image={media.bannerImage || media.coverImage.extraLarge}
      />

      {typeof window !== "undefined" ? (
        !window?.__kaguya__?.extId ? (
          <div className="w-full min-h-screen flex items-center justify-center">
            <ExtensionInstallAlert />
          </div>
        ) : isLoading ? (
          <div className="flex relative w-full min-h-screen">
            <Loading />
          </div>
        ) : !hasChapters ? (
          <div className="flex flex-col items-center absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 space-y-4">
            <p className="text-4xl font-semibold text-center">｡゜(｀Д´)゜｡</p>

            <p className="text-xl text-center">
              {t("error_message", {
                error: t("no_chapters_message"),
              })}
            </p>

            <Button className="w-[max-content]" primary onClick={back}>
              {t("error_goback")}
            </Button>
          </div>
        ) : (
          <ReadPage sourceId={sourceId} chapters={chapters} media={media} />
        )
      ) : null}
    </React.Fragment>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { params },
}) => {
  // /read/160188/animet/150312
  // /read/mediaID/sourceId/chapterId

  try {
    const media = await getMediaDetails({
      type: MediaType.Manga,
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
ReadPageContainer.getLayout = (page) => page;

export default ReadPageContainer;
