import Button from "@/components/shared/Button";
import FileUploading, { FileUploader } from "@/components/shared/FileUploading";
import Loading from "@/components/shared/Loading";
import Select from "@/components/shared/Select";
import { supportedUploadVideoFormats } from "@/constants";
import useHostings from "@/hooks/useHostings";
import { UploadType } from "@/types";
import { memo, useMemo, useRef, useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";

export type VideoState = {
  video: File | string;
  hostingId: string;
};

export type VideoUploadOnChange = ({ video, hostingId }: VideoState) => void;

export interface VideoUploadProps {
  onChange?: VideoUploadOnChange;
}

const VideoUpload: React.FC<VideoUploadProps> = ({ onChange }) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const { data, isLoading } = useHostings();

  const [hostingId, setHostingId] = useState<string>(null);

  const handleFileChange = (fileList: File[]) => {
    onChange?.({ video: fileList[0], hostingId });
  };

  const handleTextAreaBlur = () => {
    onChange?.({ video: textAreaRef.current.value, hostingId });
  };

  const selectValue = useMemo(() => {
    if (isLoading) return [];

    return data.map((hosting) => ({ value: hosting.id, label: hosting.name }));
  }, [data, isLoading]);

  const handleSelectChange = ({ value }: { value: string }) => {
    setHostingId(value);
  };

  const selectedHosting = useMemo(() => {
    if (isLoading) return null;
    if (!hostingId) return null;

    return data.find((hosting) => hosting.id === hostingId);
  }, [data, hostingId, isLoading]);

  return (
    <div className="relative">
      {isLoading ? (
        <Loading />
      ) : (
        <Tabs selectedTabClassName="bg-primary-500 rounded-md">
          <div className="flex justify-between items-center gap-2 mb-4">
            <TabList className="flex items-center gap-2">
              {selectedHosting?.uploadTypes?.includes(UploadType.File) && (
                <Tab className="cursor-pointer p-2">File upload</Tab>
              )}

              {selectedHosting?.uploadTypes?.includes(UploadType.Remote) && (
                <Tab className="cursor-pointer p-2">Remote upload</Tab>
              )}
            </TabList>

            <Select
              options={selectValue}
              placeholder="Hosting"
              onChange={handleSelectChange}
            />
          </div>

          {selectedHosting?.uploadTypes?.includes(UploadType.File) && (
            <TabPanel>
              <FileUploading
                onChange={handleFileChange}
                acceptType={supportedUploadVideoFormats}
              >
                {(props) => {
                  const file = props.fileList[0];

                  if (!file) {
                    return <FileUploader {...props} />;
                  }

                  const src = URL.createObjectURL(file);

                  return (
                    <div className="relative">
                      <div className="relative w-full flex items-center aspect-w-16 aspect-h-9">
                        <video controls src={src} className="object-contain" />
                      </div>
                      <div className="bg-background-800 absolute -top-2 -right-2 flex items-center">
                        <Button
                          secondary
                          onClick={() => props.onFileUpdate(0)}
                          LeftIcon={AiOutlineEdit}
                          iconClassName="w-6 h-6"
                          className="!p-1"
                        />

                        <Button
                          secondary
                          onClick={() => props.onFileRemove(0)}
                          LeftIcon={AiOutlineDelete}
                          iconClassName="text-red-500 w-6 h-6"
                          className="!p-1"
                        />
                      </div>
                    </div>
                  );
                }}
              </FileUploading>
            </TabPanel>
          )}

          {selectedHosting?.uploadTypes?.includes(UploadType.Remote) && (
            <TabPanel>
              <textarea
                ref={textAreaRef}
                onBlur={handleTextAreaBlur}
                className="mt-2 p-2 w-full h-36 bg-background-900 text-white border-gray-300 border"
                placeholder={
                  selectedHosting?.supportedUrlFormats?.join("\n") ||
                  "Video url here."
                }
              />
            </TabPanel>
          )}
        </Tabs>
      )}
    </div>
  );
};

export default memo(VideoUpload);
