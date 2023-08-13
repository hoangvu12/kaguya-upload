import Input, { InputProps } from "@/components/shared/Input";
import React, { useState } from "react";
import ReactImageUploading, { ImageListType } from "react-images-uploading";
import { FileBox, FileUploader } from "../shared/FileUploading";
import Image from "../shared/Image";
import ReactFileUploading from "react-files-uploading";
import Button from "../shared/Button";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { supportedUploadImageFormats } from "@/constants";
import { uploadFile } from "@/services/upload";
import { toast } from "react-toastify";

interface EpisodeThumbnailUploadProps {
  onChange: (episodeNumber: string) => void;
  initialThumbnailFile?: File;
}

const EpisodeThumbnailUpload: React.FC<EpisodeThumbnailUploadProps> = ({
  onChange,
  initialThumbnailFile,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState(
    initialThumbnailFile ? [initialThumbnailFile] : []
  );

  const onUploadChange = async (value: File[]) => {
    setIsUploading(true);

    const toastId = toast.loading("Uploading...");

    const [attachment] = await uploadFile(value[0]);

    toast.update(toastId, {
      render: "Thumbnail uploaded",
      type: "success",
      isLoading: false,
      autoClose: 2000,
    });

    setIsUploading(false);

    onChange?.(attachment.proxy_url);

    setFiles(value);
  };

  return (
    <div className="space-y-2">
      <label>Thumbnail (optional)</label>

      <ReactFileUploading
        multiple
        value={files}
        onChange={onUploadChange}
        maxNumber={1}
        acceptType={supportedUploadImageFormats}
      >
        {({ fileList, ...props }) => {
          if (!fileList.length)
            return (
              <div className="w-full aspect-w-16 aspect-h-9">
                <FileUploader fileList={fileList} {...props} />
              </div>
            );

          const file = fileList[0];

          const imageSrc = URL.createObjectURL(file);

          return (
            <div className="relative w-full">
              <div className="aspect-w-16 aspect-h-9">
                <Image
                  src={imageSrc}
                  alt={file.name}
                  layout="fill"
                  objectFit="cover"
                  unoptimized
                />
              </div>

              <div className="bg-background-800 absolute top-0 right-0 flex items-center">
                <Button
                  secondary
                  onClick={() => props.onFileUpdate(0)}
                  LeftIcon={AiOutlineEdit}
                  iconClassName="w-6 h-6"
                  className="!p-1"
                  disabled={isUploading}
                />

                <Button
                  secondary
                  onClick={() => props.onFileRemove(0)}
                  LeftIcon={AiOutlineDelete}
                  iconClassName="text-red-500 w-6 h-6"
                  className="!p-1"
                  disabled={isUploading}
                />
              </div>
            </div>
          );
        }}
      </ReactFileUploading>
    </div>
  );
};

export default EpisodeThumbnailUpload;
