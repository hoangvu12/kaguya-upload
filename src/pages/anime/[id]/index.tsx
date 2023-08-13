import React from "react";

import MediaDetails from "@/components/features/MediaDetails";
import UploadContainer from "@/components/features/UploadContainer";
import UploadLayout from "@/components/layouts/UploadLayout";
import BaseButton from "@/components/shared/BaseButton";
import Button from "@/components/shared/Button";
import DeleteConfirmation from "@/components/shared/DeleteConfirmation";
import Link from "@/components/shared/Link";
import Loading from "@/components/shared/Loading";
import Section from "@/components/shared/Section";
import { UploadMediaProvider } from "@/contexts/UploadMediaContext";
import withUser from "@/hocs/withUser";
import useAnimeSourceDelete from "@/hooks/useAnimeSourceDelete";
import useMediaDetails from "@/hooks/useMediaDetails";
import useUploadedEpisodes from "@/hooks/useUploadedEpisodes";
import { Source } from "@/types";
import { MediaType } from "@/types/anilist";
import { sortMediaUnit } from "@/types/data";
import { User, supabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextPage } from "next";
import { useMemo } from "react";
import { AiFillDelete } from "react-icons/ai";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useQueryClient } from "react-query";

interface UploadAnimePageProps {
  user: User;
  sourceId: string;
  mediaId: number;
}

const UploadAnimePage: NextPage<UploadAnimePageProps> = ({
  sourceId,
  mediaId,
}) => {
  const { data: anime, isLoading: mediaLoading } = useMediaDetails({
    type: MediaType.Anime,
    id: mediaId,
  });

  const queryClient = useQueryClient();

  const { mutateAsync: animeSourceDelete, isLoading: deleteLoading } =
    useAnimeSourceDelete(`${sourceId}-${mediaId}`);

  const { data: uploadedEpisodes, isLoading: episodesLoading } =
    useUploadedEpisodes({
      mediaId,
      sourceId,
    });

  const sortedEpisodes = useMemo(() => {
    if (episodesLoading) return [];

    return sortMediaUnit(uploadedEpisodes);
  }, [episodesLoading, uploadedEpisodes]);

  const handleConfirm = async () => {
    await animeSourceDelete(null, {
      onSuccess: () => {
        queryClient.invalidateQueries([
          "uploaded-episodes",
          { mediaId, sourceId },
        ]);
      },
    });
  };

  return (
    <React.Fragment>
      <UploadContainer className="pb-12">
        {mediaLoading || episodesLoading ? (
          <Loading />
        ) : (
          <UploadMediaProvider value={{ sourceId, mediaId }}>
            <div className="space-y-8">
              <MediaDetails media={anime} />

              <div className="mt-8">
                <div className="w-full flex justify-end items-center gap-x-2 [&>*]:w-max mb-8">
                  <Link href={`/anime/${mediaId}/episodes/create`}>
                    <a>
                      <Button LeftIcon={IoIosAddCircleOutline} primary>
                        New episode
                      </Button>
                    </a>
                  </Link>
                </div>

                <div className="space-y-2">
                  {sortedEpisodes.map((episode) => (
                    <Link
                      key={episode.slug}
                      href={`/anime/${mediaId}/episodes/${episode.slug}`}
                    >
                      <a className="relative block">
                        <BaseButton className="p-3 w-full !bg-background-900 hover:!bg-white/20 rounded-md">
                          {episode.number} - {episode.title}
                        </BaseButton>

                        {!episode.published && (
                          <span className="rounded-md top-1/2 -translate-y-1/2 px-2 py-1 bg-primary-700 absolute right-5">
                            Not yet published
                          </span>
                        )}
                      </a>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </UploadMediaProvider>
        )}
      </UploadContainer>

      {!mediaLoading && (
        <Section className="fixed bottom-0 py-3 flex justify-end gap-2 items-center bg-background-800 w-full md:w-4/5">
          <DeleteConfirmation
            onConfirm={handleConfirm}
            className="space-y-4"
            confirmString={anime.title.userPreferred}
            reference={
              <Button
                LeftIcon={AiFillDelete}
                isLoading={deleteLoading}
                className="text-red-500 bg-red-500/20 hover:text-white hover:bg-red-500/80"
              >
                Delete
              </Button>
            }
          >
            <h1 className="text-2xl font-semibold">
              Are you sure to delete the Anime?
            </h1>

            <p>
              Once deleted, you cannot restore it. This will delete absolutely
              any data related to this Anime.
            </p>
          </DeleteConfirmation>
        </Section>
      )}
    </React.Fragment>
  );
};

export default UploadAnimePage;

export const getServerSideProps = withUser({
  async getServerSideProps(ctx, user) {
    try {
      const { data: sourceAddedByUser, error } = await supabaseClient
        .from<Source>("kaguya_sources")
        .select("id")
        .eq("userId", user.id)
        .single();

      if (error || !sourceAddedByUser?.id) {
        throw error;
      }

      return {
        props: {
          sourceId: sourceAddedByUser.id,
          mediaId: ctx.query.id,
        },
      };
    } catch (err) {
      return {
        redirect: {
          statusCode: 302,
          destination: "/login",
        },
      };
    }
  },
});

// @ts-ignore
UploadAnimePage.getLayout = (children) => (
  <UploadLayout>{children}</UploadLayout>
);
