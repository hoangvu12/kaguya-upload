import Button from "@/components/shared/Button";
import Loading from "@/components/shared/Loading";
import useUpdateFonts from "@/hooks/useUpdateFonts";
import { Attachment } from "@/services/upload";
import { createFileFromUrl } from "@/utils";
import React, { useState } from "react";
import { useQuery } from "react-query";
import FontUpload, { FontFile } from "./FontUpload";

interface FontUpdateProps {
  initialFonts?: Attachment[];
  episodeSlug: string;
}

const FontUpdate: React.FC<FontUpdateProps> = ({
  initialFonts,
  episodeSlug,
}) => {
  const [files, setFiles] = useState<FontFile[]>([]);

  const { data: initialFiles, isLoading: initialFilesLoading } = useQuery<
    FontFile[]
  >(["uploaded-font-files", initialFonts], async () => {
    if (!initialFonts?.length) return [];

    return Promise.all<FontFile>(
      initialFonts.map(async (file) => {
        const fileObj = await createFileFromUrl(file.url, file.filename);

        return {
          file: fileObj,
          name: file.ctx.name,
        };
      })
    );
  });

  const { mutate: updateFonts, isLoading: updateLoading } =
    useUpdateFonts(episodeSlug);

  const handleUpdateClick = () => {
    updateFonts(files);
  };

  return initialFilesLoading ? (
    <Loading />
  ) : (
    <div className="space-y-2">
      <FontUpload onChange={setFiles} initialFonts={initialFiles} />

      <Button
        isLoading={updateLoading}
        className="ml-auto"
        primary
        onClick={handleUpdateClick}
      >
        Update
      </Button>
    </div>
  );
};

export default FontUpdate;
