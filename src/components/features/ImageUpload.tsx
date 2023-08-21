import BaseButton from "@/components/shared/BaseButton";
import Button from "@/components/shared/Button";
import FileUploading, {
  FileUploader,
  FileUploadingProps,
} from "@/components/shared/FileUploading";
import Image from "@/components/shared/Image";
import { supportedUploadImageFormats } from "@/constants";
import SortableList, { SortableItem } from "react-easy-sort";
import React, { useCallback, useEffect, useState } from "react";
import {
  AiFillFileAdd,
  AiOutlineDelete,
  AiOutlineDrag,
  AiOutlineEdit,
} from "react-icons/ai";
import { arrayMoveImmutable } from "@/utils";

interface ImageUploadProps extends FileUploadingProps {
  onChange?: (images: File[]) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onChange, ...props }) => {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = useCallback((fileList: File[]) => {
    setFiles(fileList);
  }, []);

  const handleSortEnd = useCallback((oldIndex: number, newIndex: number) => {
    setFiles((files) => arrayMoveImmutable(files, oldIndex, newIndex));
  }, []);

  useEffect(() => {
    onChange?.(files);
  }, [files, onChange]);

  return (
    <FileUploading
      onChange={handleFileChange}
      acceptType={supportedUploadImageFormats}
      multiple
      value={files}
      {...props}
    >
      {(props) => {
        if (!props.fileList?.length) return <FileUploader {...props} />;

        return (
          <SortableList
            onSortEnd={handleSortEnd}
            as="div"
            className="grid grid-cols-4 gap-4 bg-background-900 p-3"
          >
            {props.fileList.map((file, index) => {
              const key = file.name + file.type;

              return (
                <SortableItem key={key}>
                  <div className="relative col-span-1">
                    <ImageComponent file={file} />

                    <div className="z-10 bg-background-800 absolute top-0 right-0 flex items-center">
                      <Button
                        secondary
                        onClick={() => props.onFileUpdate(index)}
                        LeftIcon={AiOutlineEdit}
                        iconClassName="w-6 h-6"
                        className="!p-1"
                      />

                      <Button
                        secondary
                        onClick={() => props.onFileRemove(index)}
                        LeftIcon={AiOutlineDelete}
                        iconClassName="text-red-500 w-6 h-6"
                        className="!p-1"
                      />
                    </div>

                    <div className="z-0 absolute inset-0 flex items-center justify-center">
                      <AiOutlineDrag className="cursor-pointer p-4 w-16 h-16 bg-black/60 rounded-full" />
                    </div>
                  </div>
                </SortableItem>
              );
            })}

            <BaseButton
              LeftIcon={AiFillFileAdd}
              onClick={props.onFileUpload}
              className="relative aspect-w-9 aspect-h-14 col-span-1 border border-dashed border-gray-300 hover:border-white bg-transparent"
              iconClassName="w-16 h-16 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"
            />
          </SortableList>
        );
      }}
    </FileUploading>
  );
};

const ImageComponent = React.memo(
  ({ file }) => {
    const imageSrc = URL.createObjectURL(file);

    return (
      <div className="aspect-[9/14]">
        <Image
          src={imageSrc}
          alt={file.name}
          layout="fill"
          objectFit="cover"
          unoptimized
        />
      </div>
    );
  },
  (prev, next) =>
    prev.file.name === next.file.name && prev.file.type === next.file.type
) as React.FC<{
  file: File;
}>;

ImageComponent.displayName = "ImageComponent";

const toBase64 = (file: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

export default ImageUpload;
