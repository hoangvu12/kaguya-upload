import ChapterNumberUpdate from "@/components/features/ChapterNumberUpdate";
import ChapterTitleUpdate from "@/components/features/ChapterTitleUpdate";
import ImageUpdate from "@/components/features/ImageUpdate";
import UploadContainer from "@/components/features/UploadContainer";
import UploadSection from "@/components/features/UploadSection";
import UploadLayout from "@/components/layouts/UploadLayout";
import Button from "@/components/shared/Button";
import DeleteConfirmation from "@/components/shared/DeleteConfirmation";
import Link from "@/components/shared/Link";
import Loading from "@/components/shared/Loading";
import Section from "@/components/shared/Section";
import Select from "@/components/shared/Select";
import { MAIN_WEBSITE_DOMAIN, supportedUploadImageFormats } from "@/constants";
import { UploadMediaProvider } from "@/contexts/UploadMediaContext";
import withUser from "@/hocs/withUser";
import useChapterDelete from "@/hooks/useChapterDelete";
import usePublishChapter from "@/hooks/usePublishChapter";
import useUploadedChapter from "@/hooks/useUploadedChapter";
import useUploadedChapters from "@/hooks/useUploadedChapters";
import { Source } from "@/types";
import { sortMediaUnit } from "@/types/data";
import { User, supabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { isMobileOnly } from "react-device-detect";
import { AiOutlinePlus } from "react-icons/ai";
import { BsPlayFill } from "react-icons/bs";
import { useQueryClient } from "react-query";

interface UploadChapterEditPageProps {
  user: User;
  sourceId: string;
  mediaId: number;
  chapterSlug: string;
}

const UploadChapterEditPage: NextPage<UploadChapterEditPageProps> = ({
  mediaId,
  sourceId,
  chapterSlug,
}) => {
  const { data, isLoading } = useUploadedChapter(chapterSlug);
  const { mutate: deleteChapter, isLoading: deleteLoading } =
    useChapterDelete(chapterSlug);
  const { mutate: publishChapter, isLoading: publishLoading } =
    usePublishChapter(chapterSlug);

  const chapterId = useMemo(() => chapterSlug.split("-")[1], [chapterSlug]);

  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: uploadedChapters, isLoading: chaptersLoading } =
    useUploadedChapters({
      mediaId,
      sourceId,
    });

  const sortedChapters = useMemo(() => {
    if (chaptersLoading) return [];

    return sortMediaUnit(uploadedChapters);
  }, [chaptersLoading, uploadedChapters]);

  const currentChapter = useMemo(() => {
    return sortedChapters.find((chapter) => chapter.slug === chapterSlug);
  }, [chapterSlug, sortedChapters]);

  const handleDelete = () => {
    deleteChapter(null, {
      onSuccess: () => {
        router.replace(`/manga/${mediaId}`);
      },
    });
  };

  const handlePublish = () => {
    publishChapter(null, {
      onSuccess: () => {
        queryClient.invalidateQueries(["uploaded-chapter", chapterSlug]);
      },
    });
  };

  return (
    <UploadMediaProvider value={{ mediaId, sourceId }}>
      <UploadContainer className="pb-8">
        {isLoading ? (
          <Loading />
        ) : (
          <div className="space-y-16">
            <UploadSection>
              <UploadSection.Left>
                <label className="font-semibold text-2xl">Chapter</label>
              </UploadSection.Left>

              <UploadSection.Right>
                <ChapterNumberUpdate
                  initialNumber={data.number}
                  chapterSlug={data.slug}
                />

                <ChapterTitleUpdate
                  initialTitle={data.title}
                  chapterSlug={data.slug}
                />
              </UploadSection.Right>
            </UploadSection>

            <UploadSection>
              <UploadSection.Left>
                <label className="font-semibold text-2xl">Images</label>
                <p className="text-sm text-gray-300">
                  Support {supportedUploadImageFormats.join(", ")}
                </p>
              </UploadSection.Left>

              <UploadSection.Right className="relative space-y-1">
                <ImageUpdate
                  initialImages={data?.images?.[0]?.images || []}
                  chapterSlug={chapterSlug}
                />
              </UploadSection.Right>
            </UploadSection>
          </div>
        )}
      </UploadContainer>

      {!isLoading && (
        <Section className="py-3 flex justify-between items-center fixed bottom-0 w-full md:w-4/5 bg-background-800">
          <DeleteConfirmation
            isLoading={deleteLoading}
            onConfirm={handleDelete}
            className="space-y-4"
          >
            <h1 className="text-2xl font-semibold">
              Are you sure to delete the Manga?
            </h1>

            <p>
              Once deleted, you cannot restore it. This will delete absolutely
              any data related to this chapter.
            </p>
          </DeleteConfirmation>

          {!chaptersLoading && (
            <div className="flex gap-2 justify-end items-center mx-2 w-full">
              <p className="hidden md:block">Chapters: </p>

              <Select
                styles={{
                  container: (provided) => ({
                    ...provided,
                    backgroundColor: "#1a1a1a",
                    ...(isMobileOnly
                      ? {
                          width: "100%",
                        }
                      : {
                          minWidth: "12rem",
                          maxWidth: "14rem",
                        }),
                  }),
                  control: (provided) => ({
                    ...provided,
                    backgroundColor: "#1a1a1a",
                    ...(isMobileOnly
                      ? {
                          width: "100%",
                        }
                      : {
                          minWidth: "12rem",
                          maxWidth: "14rem",
                        }),
                  }),
                }}
                options={sortedChapters.map((chapter) => ({
                  value: chapter.slug,
                  label: chapter.number,
                }))}
                onChange={({ value }) => {
                  router.replace(`/anime/${mediaId}/episodes/${value}`);
                }}
                menuPlacement="top"
                value={{
                  value: currentChapter.slug,
                  label: currentChapter.number,
                }}
                isClearable={false}
                isSearchable={false}
              />
            </div>
          )}

          <div className="flex gap-2 items-center shrink-0">
            <Link href={`/manga/${mediaId}/chapters/create`}>
              <a>
                <Button
                  LeftIcon={isMobileOnly ? AiOutlinePlus : null}
                  className="!bg-gray-600 hover:!bg-opacity-80"
                >
                  <p className="hidden md:block text-white">
                    Create new chapter
                  </p>
                </Button>
              </a>
            </Link>

            {data.published ? (
              <Link
                href={`https://${MAIN_WEBSITE_DOMAIN}/manga/read/${mediaId}/${sourceId}/${chapterId}`}
              >
                <a target="_blank" rel="noreferrer">
                  <Button LeftIcon={isMobileOnly ? BsPlayFill : null} primary>
                    <p className="hidden md:block">Reac chapter</p>
                  </Button>{" "}
                </a>
              </Link>
            ) : (
              <Button
                isLoading={publishLoading}
                primary
                onClick={handlePublish}
              >
                Publish chapter
              </Button>
            )}
          </div>
        </Section>
      )}
    </UploadMediaProvider>
  );
};

export default UploadChapterEditPage;

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
        chapterSlug: ctx.query.chapterSlug,
      },
    };
  },
});

// @ts-ignore
UploadChapterEditPage.getLayout = (children) => (
  <UploadLayout>{children}</UploadLayout>
);
