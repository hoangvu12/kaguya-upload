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
import useMangaSourceDelete from "@/hooks/useMangaSourceDelete";
import useMediaDetails from "@/hooks/useMediaDetails";
import useUploadedChapters from "@/hooks/useUploadedChapters";
import { Source } from "@/types";
import { MediaType } from "@/types/anilist";
import { sortMediaUnit } from "@/types/data";
import { User, supabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextPage } from "next";
import React, { useMemo } from "react";
import { AiFillDelete } from "react-icons/ai";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useQueryClient } from "react-query";

interface UploadMangaPageProps {
  user: User;
  sourceId: string;
  mediaId: number;
}

const UploadMangaPage: NextPage<UploadMangaPageProps> = ({
  user,
  sourceId,
  mediaId,
}) => {
  const { data: manga, isLoading: mediaLoading } = useMediaDetails({
    type: MediaType.Manga,
    id: mediaId,
  });

  const queryClient = useQueryClient();

  const { mutate: mangaSourceDelete, isLoading: deleteLoading } =
    useMangaSourceDelete(`${sourceId}-${mediaId}`);

  const { data: uploadedChapters, isLoading: chaptersLoading } =
    useUploadedChapters({
      mediaId,
      sourceId,
    });

  const sortedChapters = useMemo(() => {
    if (chaptersLoading) return [];

    return sortMediaUnit(uploadedChapters);
  }, [chaptersLoading, uploadedChapters]);

  const handleConfirm = () => {
    mangaSourceDelete(null, {
      onSuccess: () => {
        queryClient.invalidateQueries([
          "uploaded-chapters",
          { mediaId, sourceId },
        ]);
      },
    });
  };

  return (
    <React.Fragment>
      <UploadContainer className="pb-12">
        {mediaLoading || chaptersLoading ? (
          <Loading />
        ) : (
          <UploadMediaProvider value={{ sourceId, mediaId }}>
            <div className="space-y-8">
              <MediaDetails media={manga} />

              <div className="mt-8">
                <div className="w-full flex justify-end items-center gap-x-2 [&>*]:w-max mb-8">
                  <Link href={`/manga/${mediaId}/chapters/create`}>
                    <a>
                      <Button LeftIcon={IoIosAddCircleOutline} primary>
                        New chapter
                      </Button>
                    </a>
                  </Link>
                </div>

                <div className="space-y-2">
                  {sortedChapters.map((chapter) => (
                    <Link
                      key={chapter.slug}
                      href={`/manga/${mediaId}/chapters/${chapter.slug}`}
                    >
                      <a className="block">
                        <BaseButton className="text-left p-3 w-full !bg-background-900 hover:!bg-white/20 rounded-md">
                          {chapter.number} - {chapter.title}
                        </BaseButton>
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
            confirmString={manga.title.userPreferred}
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
              Are you sure to delete the Manga?
            </h1>

            <p>
              Once deleted, you cannot restore it. This will delete absolutely
              any data related to this Manga.
            </p>
          </DeleteConfirmation>
        </Section>
      )}
    </React.Fragment>
  );
};

export default UploadMangaPage;

export const getServerSideProps = withUser({
  async getServerSideProps(ctx, user) {
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
  },
});

// @ts-ignore
UploadMangaPage.getLayout = (children) => (
  <UploadLayout>{children}</UploadLayout>
);
