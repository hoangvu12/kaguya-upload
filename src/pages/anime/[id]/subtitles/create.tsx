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
import useCreateSubtitle from "@/hooks/useCreateSubtitle";

interface UploadCreateEpisodePageProps {
  user: User;
  sourceId: string;
  mediaId: number;
}

const UploadCreateEpisodePage: NextPage<UploadCreateEpisodePageProps> = ({
  mediaId,
  sourceId,
}) => {
  const [subtitles, setSubtitles] = useState<SubtitleFile[]>([]);
  const [fonts, setFonts] = useState<File[]>([]);

  const { mutate: createSubtitle } = useCreateSubtitle({
    mediaId,
  });

  const onSubmit = () => {
    createSubtitle({
      subtitles,
      fonts,
    });
  };

  return (
    <React.Fragment>
      <UploadContainer className="pb-40">
        <div className="space-y-16">
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
                Only .ass subtitles supported
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
