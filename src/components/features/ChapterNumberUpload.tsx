import Input, { InputProps } from "@/components/shared/Input";
import React, { useState } from "react";

interface ChapterNumberUploadProps {
  onChange: (episodeNumber: number) => void;
  inputProps?: Omit<InputProps, "ref">;
}

const ChapterNumberUpload: React.FC<ChapterNumberUploadProps> = ({
  onChange,
  inputProps,
}) => {
  const [chapterNumber, setChapterNumber] = useState(null);

  return (
    <div className="space-y-2">
      <label>Number (required)</label>

      <Input
        placeholder="1"
        className="px-3 py-2"
        onChange={(e) => {
          const target = e.target as HTMLInputElement;

          setChapterNumber(Number(target.value));
        }}
        onBlur={() => {
          onChange?.(chapterNumber);
        }}
        {...inputProps}
      />
    </div>
  );
};

export default ChapterNumberUpload;
