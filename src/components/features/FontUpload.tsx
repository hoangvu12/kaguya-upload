import FileUploading, {
  FileBox,
  FileUploader,
  FileUploadingProps,
} from "@/components/shared/FileUploading";
import { supportedUploadFontFormats } from "@/constants";
import { randomString } from "@/utils";
import React, { useState } from "react";
import { AiFillFileAdd } from "react-icons/ai";
import BaseButton from "../shared/BaseButton";
import Input from "../shared/Input";

export interface FontFile {
  file: File;
  name: string;
}

interface FontUploadProps extends Omit<FileUploadingProps, "onChange"> {
  onChange: (files: FontFile[]) => void;
  initialFonts?: FontFile[];
}

const FontUpload: React.FC<FontUploadProps> = ({
  initialFonts = [],
  onChange,
  ...props
}) => {
  const [filesCtx, setFilesCtx] = useState<FontFile[]>(initialFonts);
  const [files, setFiles] = useState<File[]>(
    initialFonts?.map((font) => font.file) || []
  );

  const handleChange = (files: File[]) => {
    setFiles(files);
    onChange?.(filesCtx);
  };

  return (
    <FileUploading
      value={files}
      multiple
      acceptType={supportedUploadFontFormats}
      onChange={handleChange}
      {...props}
    >
      {(props) => {
        if (props.fileList.length === 0) {
          return <FileUploader {...props} />;
        }

        return (
          <div className="space-y-4">
            {props.fileList.map((file, index) => {
              const fileKey = randomString(8);

              if (!filesCtx[index]) {
                filesCtx[index] = {
                  file,
                  name: file.name.replace(/\.[^/.]+$/, ""),
                };
              }

              const fileContext = filesCtx[index];

              return (
                <div
                  className="flex flex-col gap-4 md:flex-row md:gap-8 flex-wrap"
                  key={fileKey}
                >
                  <FileBox
                    file={file}
                    index={index}
                    onFileRemove={() => {
                      filesCtx.splice(index, 1);

                      props.onFileRemove(index);
                    }}
                    key={`file-${index}`}
                  />

                  <div className="space-y-2 flex-1">
                    <div className="space-y-1">
                      <label>Font name (ex: Arial)</label>

                      <Input
                        onChange={(e) => {
                          const target = e.target as HTMLInputElement;

                          fileContext.name = target.value;

                          filesCtx[index] = fileContext;

                          setFilesCtx(filesCtx);
                        }}
                        containerClassName="w-full"
                        className="px-3 py-2"
                        placeholder="Language"
                        defaultValue={filesCtx[index].name}
                      />
                    </div>
                  </div>
                </div>
              );
            })}

            <BaseButton
              LeftIcon={AiFillFileAdd}
              onClick={props.onFileUpload}
              className="flex items-center justify-center w-40 h-40 border border-dashed border-gray-300 hover:border-white bg-transparent"
              iconClassName="w-16 h-16"
            />
          </div>
        );
      }}
    </FileUploading>
  );
};

export default FontUpload;
