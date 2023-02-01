import Button from "@/components/shared/Button";
import Loading from "@/components/shared/Loading";
import useUpdateImages from "@/hooks/useUpdateImages";
import { Attachment } from "@/services/upload";
import { createAttachmentUrl, createFileFromUrl } from "@/utils";
import { useRouter } from "next/dist/client/router";
import React, { useState } from "react";
import { useQuery } from "react-query";
import ImageUpload from "./ImageUpload";

interface ImageUpdateProps {
  initialImages: Attachment[];
  chapterSlug: string;
}

const ImageUpdate: React.FC<ImageUpdateProps> = ({
  initialImages,
  chapterSlug,
}) => {
  const [files, setFiles] = useState<File[]>(null);
  const { locale } = useRouter();

  const { data: initialFiles, isLoading: initialFilesLoading } = useQuery<
    File[]
  >(["uploaded-images", initialImages], async () => {
    if (!initialImages?.length) return [];

    return Promise.all<File>(
      initialImages.map((file) =>
        createFileFromUrl(createAttachmentUrl(file.url, locale), file.filename)
      )
    );
  });

  const { mutate: updateVideo, isLoading: isUpdateLoading } =
    useUpdateImages(chapterSlug);

  const handleUpdate = () => {
    updateVideo(files);
  };

  return initialFilesLoading ? (
    <Loading />
  ) : (
    <div className="space-y-4">
      <ImageUpload initialFiles={initialFiles} onChange={setFiles} />

      <Button
        className="ml-auto"
        isLoading={isUpdateLoading}
        onClick={handleUpdate}
        primary
      >
        Upload
      </Button>
    </div>
  );
};

export default ImageUpdate;
