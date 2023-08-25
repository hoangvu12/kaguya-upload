import EpisodeTitleUpload from "@/components/features/EpisodeTitleUpload";
import EpisodeNumberUpload from "@/components/features/EpisodeNumberUpload";
import FontUpload from "@/components/features/FontUpload";
import SubtitleUpload, {
  SubtitleFile,
} from "@/components/features/SubtitleUpload";
import UploadContainer from "@/components/features/UploadContainer";
import UploadSection from "@/components/features/UploadSection";
import VideoUpload, { VideoState } from "@/components/features/VideoUpload";
import UploadLayout from "@/components/layouts/UploadLayout";
import Button from "@/components/shared/Button";
import Section from "@/components/shared/Section";
import {
  supportedUploadFontFormats,
  supportedUploadSubtitleFormats,
  supportedUploadVideoFormats,
} from "@/constants";
import withUser from "@/hocs/withUser";
import useCreateEpisode from "@/hooks/useCreateEpisode";
import { Source } from "@/types";
import { User, supabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextPage } from "next";
import React, { useState } from "react";
import EpisodeDescriptionUpload from "@/components/features/EpisodeDescriptionUpload";
import EpisodeThumbnailUpload from "@/components/features/EpisodeThumbnailUpload";

interface UploadCreateEpisodePageProps {
  user: User;
  sourceId: string;
  mediaId: number;
}

const UploadCreateEpisodePage: NextPage<UploadCreateEpisodePageProps> = ({
  mediaId,
  sourceId,
}) => {
  const [videoState, setVideoState] = useState<VideoState>(null);
  const [subtitles, setSubtitles] = useState<SubtitleFile[]>([]);
  const [fonts, setFonts] = useState<File[]>([]);
  const [episodeTitle, setEpisodeTitle] = useState("");
  const [episodeNumber, setEpisodeNumber] = useState<number>(null);
  const [episodeThumbnail, setEpisodeThumbnail] = useState("");
  const [episodeDescription, setEpisodeDescription] = useState("");

  const { mutate: createEpisode } = useCreateEpisode({
    mediaId,
    sourceId,
  });

  const onSubmit = () => {
    createEpisode({
      episode: {
        number: episodeNumber,
        title: episodeTitle,
        thumbnail: episodeThumbnail,
        description: episodeDescription,
      },
      fonts,
      subtitles,
      video: videoState.video,
      hostingId: videoState.hostingId,
    });
  };

  return (
    <React.Fragment>
      <UploadContainer className="pb-40">
        <div className="space-y-16">
          <UploadSection>
            <UploadSection.Left>
              <label className="font-semibold text-2xl">Episode</label>
            </UploadSection.Left>

            <UploadSection.Right>
              <div className="flex flex-wrap md:flex-nowrap gap-8 mb-4">
                <div className="w-full md:w-1/3">
                  <EpisodeThumbnailUpload onChange={setEpisodeThumbnail} />
                </div>
                <div className="w-full md:w-2/3 space-y-4">
                  <EpisodeNumberUpload onChange={setEpisodeNumber} />
                  <EpisodeTitleUpload onChange={setEpisodeTitle} />
                </div>
              </div>

              <EpisodeDescriptionUpload onChange={setEpisodeDescription} />
            </UploadSection.Right>
          </UploadSection>

          <UploadSection>
            <UploadSection.Left>
              <label className="font-semibold text-2xl">Video</label>
              <p className="text-sm text-gray-300">
                Support {supportedUploadVideoFormats.join(", ")}
              </p>
            </UploadSection.Left>

            <UploadSection.Right>
              <VideoUpload onChange={setVideoState} />
            </UploadSection.Right>
          </UploadSection>

          <UploadSection>
            <UploadSection.Left>
              <label className="font-semibold text-2xl">Subtitles</label>
              <p className="text-sm text-gray-300">
                Support {supportedUploadSubtitleFormats.join(", ")}
              </p>
            </UploadSection.Left>

            <UploadSection.Right>
              <SubtitleUpload onChange={setSubtitles} />
            </UploadSection.Right>
          </UploadSection>

          <UploadSection>
            <UploadSection.Left>
              <label className="font-semibold text-2xl">Fonts</label>
              <p className="text-sm text-gray-300">
                Support {supportedUploadFontFormats.slice(0, 6).join(", ")},
                etc...
              </p>
            </UploadSection.Left>

            <UploadSection.Right>
              <FontUpload onChange={setFonts} />
            </UploadSection.Right>
          </UploadSection>
        </div>
      </UploadContainer>

      <Section className="py-3 flex justify-end gap-2 items-center fixed bottom-0 w-full md:w-4/5 bg-background-800">
        <Button onClick={onSubmit} primary>
          Upload
        </Button>
      </Section>
    </React.Fragment>
  );
};

export default UploadCreateEpisodePage;

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
UploadCreateEpisodePage.getLayout = (children) => (
  <UploadLayout>{children}</UploadLayout>
);
