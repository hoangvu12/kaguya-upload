import EpisodeUpdate from "@/components/features/EpisodeUpdate";
import FontUpdate from "@/components/features/FontUpdate";
import SubtitleUpdate from "@/components/features/SubtitleUpdate";
import UploadContainer from "@/components/features/UploadContainer";
import UploadSection from "@/components/features/UploadSection";
import VideoUpdate from "@/components/features/VideoUpdate";
import UploadLayout from "@/components/layouts/UploadLayout";
import Button from "@/components/shared/Button";
import DeleteConfirmation from "@/components/shared/DeleteConfirmation";
import Link from "@/components/shared/Link";
import Loading from "@/components/shared/Loading";
import Section from "@/components/shared/Section";
import {
  MAIN_WEBSITE_DOMAIN,
  supportedUploadSubtitleFormats,
  supportedUploadVideoFormats,
} from "@/constants";
import { UploadMediaProvider } from "@/contexts/UploadMediaContext";
import withUser from "@/hocs/withUser";
import useEpisodeDelete from "@/hooks/useEpisodeDelete";
import usePublishEpisode from "@/hooks/usePublishEpisode";
import useUploadedEpisode from "@/hooks/useUploadedEpisode";
import useVideoStatus from "@/hooks/useVideoStatus";
import { Source } from "@/types";
import { User, supabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { useQueryClient } from "react-query";
import { BsPlayFill } from "react-icons/bs";
import { isMobileOnly } from "react-device-detect";
import { AiOutlinePlus } from "react-icons/ai";
import Select from "@/components/shared/Select";
import useUploadedEpisodes from "@/hooks/useUploadedEpisodes";
import { sortMediaUnit } from "@/types/data";

interface UploadEpisodeEditPageProps {
  user: User;
  sourceId: string;
  mediaId: number;
  episodeSlug: string;
}

const UploadEpisodeEditPage: NextPage<UploadEpisodeEditPageProps> = ({
  mediaId,
  sourceId,
  episodeSlug,
}) => {
  const { data, isLoading } = useUploadedEpisode(episodeSlug);
  const { mutate: deleteEpisode, isLoading: deleteLoading } =
    useEpisodeDelete(episodeSlug);
  const { mutate: publishEpisode, isLoading: publishLoading } =
    usePublishEpisode(episodeSlug);
  const { data: videoStatus, isLoading: videoStatusLoading } = useVideoStatus(
    data?.video?.video?.id,
    data?.video?.hostingId
  );

  const { data: uploadedEpisodes, isLoading: episodesLoading } =
    useUploadedEpisodes({
      mediaId,
      sourceId,
    });

  const sortedEpisodes = useMemo(() => {
    if (episodesLoading) return [];

    return sortMediaUnit(uploadedEpisodes);
  }, [episodesLoading, uploadedEpisodes]);

  const currentEpisode = useMemo(() => {
    return sortedEpisodes.find((episode) => episode.slug === episodeSlug);
  }, [episodeSlug, sortedEpisodes]);

  const router = useRouter();
  const queryClient = useQueryClient();

  const episodeId = useMemo(() => episodeSlug.split("-")[1], [episodeSlug]);

  const handleDelete = () => {
    deleteEpisode(null, {
      onSuccess: () => {
        router.replace(`/anime/${mediaId}`);
      },
    });
  };

  const handlePublish = () => {
    publishEpisode(null, {
      onSuccess: () => {
        queryClient.invalidateQueries(["uploaded-episode", episodeSlug]);
      },
    });
  };

  return (
    <UploadMediaProvider value={{ mediaId, sourceId }}>
      <UploadContainer className="pb-40">
        {isLoading || videoStatusLoading || !data?.video ? (
          <Loading />
        ) : (
          <div className="space-y-16">
            <UploadSection>
              <UploadSection.Left>
                <label className="font-semibold text-2xl">Episode</label>
              </UploadSection.Left>

              <UploadSection.Right>
                <EpisodeUpdate initialEpisode={data} />
              </UploadSection.Right>
            </UploadSection>

            <UploadSection>
              <UploadSection.Left>
                <label className="font-semibold text-2xl">Video</label>
                <p className="text-sm text-gray-300">
                  Support {supportedUploadVideoFormats.join(", ")}
                </p>
              </UploadSection.Left>

              <UploadSection.Right className="space-y-1">
                <p>
                  Video status:{" "}
                  {videoStatus?.converted ? "Converted" : "Converting"}
                </p>

                <VideoUpdate
                  initialVideo={videoStatus}
                  episodeSlug={episodeSlug}
                />
              </UploadSection.Right>
            </UploadSection>

            <UploadSection>
              <UploadSection.Left>
                <label className="font-semibold text-2xl">Subtitles</label>
                <p className="text-sm text-gray-300">
                  Support {supportedUploadSubtitleFormats.join(", ")}
                </p>
              </UploadSection.Left>

              <UploadSection.Right className="relative">
                <SubtitleUpdate
                  episodeSlug={episodeSlug}
                  initialSubtitles={data.video.subtitles}
                />
              </UploadSection.Right>
            </UploadSection>

            <UploadSection>
              <UploadSection.Left>
                <label className="font-semibold text-2xl">Fonts</label>
                <p className="text-sm text-gray-300">
                  Only .ass subtitles supported.
                </p>
              </UploadSection.Left>

              <UploadSection.Right className="relative">
                <FontUpdate
                  episodeSlug={episodeSlug}
                  initialFonts={data.video.fonts}
                />
              </UploadSection.Right>
            </UploadSection>
          </div>
        )}
      </UploadContainer>

      {!isLoading && !videoStatusLoading && (
        <Section className="py-3 flex justify-between items-center fixed bottom-0 w-full md:w-4/5 bg-background-800">
          <DeleteConfirmation
            isLoading={deleteLoading}
            onConfirm={handleDelete}
            className="space-y-4"
          >
            <h1 className="text-2xl font-semibold">
              Are you sure to delete the Anime?
            </h1>

            <p>
              Once deleted, you cannot restore it. This will delete absolutely
              any data related to this episode.
            </p>
          </DeleteConfirmation>

          <div className="flex gap-2 justify-end items-center mx-2 w-full">
            <p className="hidden md:block">Episodes: </p>

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
              options={sortedEpisodes.map((episode) => ({
                value: episode.slug,
                label: episode.number,
              }))}
              onChange={({ value }) => {
                router.replace(`/anime/${mediaId}/episodes/${value}`);
              }}
              menuPlacement="top"
              value={{
                value: currentEpisode.slug,
                label: currentEpisode.number,
              }}
              isClearable={false}
              isSearchable={false}
            />
          </div>

          <div className="flex gap-2 items-center shrink-0">
            <Link href={`/anime/${mediaId}/episodes/create`}>
              <a>
                <Button
                  LeftIcon={isMobileOnly ? AiOutlinePlus : null}
                  className="!bg-gray-600 hover:!bg-opacity-80"
                >
                  <p className="hidden md:block text-white">
                    Create new episode
                  </p>
                </Button>
              </a>
            </Link>

            {data.published ? (
              <Link
                href={`https://${MAIN_WEBSITE_DOMAIN}/anime/watch/${mediaId}/${sourceId}/${episodeId}`}
              >
                <a target="_blank" rel="noreferrer">
                  <Button LeftIcon={isMobileOnly ? BsPlayFill : null} primary>
                    <p className="hidden md:block">Watch episode</p>
                  </Button>
                </a>
              </Link>
            ) : (
              <Button
                isLoading={publishLoading}
                primary
                disabled={!videoStatus?.converted}
                onClick={handlePublish}
              >
                Publish episode
              </Button>
            )}
          </div>
        </Section>
      )}
    </UploadMediaProvider>
  );
};

export default UploadEpisodeEditPage;

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
        episodeSlug: ctx.query.episodeSlug,
      },
    };
  },
});

// @ts-ignore
UploadEpisodeEditPage.getLayout = (children) => (
  <UploadLayout>{children}</UploadLayout>
);
