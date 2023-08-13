import Input, { InputProps } from "@/components/shared/Input";
import React, { useState } from "react";

interface CHapterTitleUploadProps {
  onChange: (episodeTitle: string) => void;
  inputProps?: Omit<InputProps, "ref">;
}

const ChapterTitleUpload: React.FC<CHapterTitleUploadProps> = ({
  onChange,
  inputProps,
}) => {
  const [chapterTitle, setChapterTitle] = useState("");

  return (
    <div className="space-y-2">
      <label>Title (optional)</label>

      <Input
        placeholder="Cute girls doing cute things"
        className="px-3 py-2"
        onChange={(e) => {
          const target = e.target as HTMLInputElement;

          setChapterTitle(target.value);
        }}
        onBlur={() => {
          onChange?.(chapterTitle);
        }}
        {...inputProps}
      />
    </div>
  );
};

export default ChapterTitleUpload;
