import ChapterNumberUpload from "@/components/features/ChapterNumberUpload";
import ChapterTitleUpload from "@/components/features/ChapterTitleUpload";
import ImageUpload from "@/components/features/ImageUpload";
import UploadContainer from "@/components/features/UploadContainer";
import UploadSection from "@/components/features/UploadSection";
import UploadLayout from "@/components/layouts/UploadLayout";
import Button from "@/components/shared/Button";
import Section from "@/components/shared/Section";
import { supportedUploadImageFormats } from "@/constants";
import withUser from "@/hocs/withUser";
import useCreateChapter from "@/hooks/useCreateChapter";
import { Source } from "@/types";
import { User, supabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextPage } from "next";
import React, { useState } from "react";

interface UploadCreateChapterPageProps {
  user: User;
  sourceId: string;
  mediaId: number;
}

const UploadCreateChapterPage: NextPage<UploadCreateChapterPageProps> = ({
  mediaId,
  sourceId,
}) => {
  const [images, setImages] = useState<File[]>([]);
  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterNumber, setChapterNumber] = useState(null);

  const { mutate: createChapter } = useCreateChapter({
    mediaId,
    sourceId,
  });

  const onSubmit = () => {
    createChapter({
      chapter: {
        title: chapterTitle,
        number: chapterNumber,
      },
      images,
    });
  };

  return (
    <React.Fragment>
      <UploadContainer className="pb-12">
        <div className="space-y-16">
          <UploadSection>
            <UploadSection.Left>
              <label className="font-semibold text-2xl">Chapter</label>
            </UploadSection.Left>

            <UploadSection.Right className="space-y-4">
              <ChapterNumberUpload onChange={setChapterNumber} />
              <ChapterTitleUpload onChange={setChapterTitle} />
            </UploadSection.Right>
          </UploadSection>

          <UploadSection>
            <UploadSection.Left>
              <label className="font-semibold text-2xl">Images</label>
              <p className="text-sm text-gray-300">
                Support {supportedUploadImageFormats.join(", ")}
              </p>
            </UploadSection.Left>

            <UploadSection.Right>
              <ImageUpload onChange={setImages} />
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

export default UploadCreateChapterPage;

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
UploadCreateChapterPage.getLayout = (children) => (
  <UploadLayout>{children}</UploadLayout>
);
