import Button from "@/components/shared/Button";
import useUpdateChapter from "@/hooks/useUpdateChapter";
import React, { useState } from "react";
import ChapterNumberUpload from "./ChapterNumberUpload";

interface ChapterNumberUpdateProps {
  initialNumber?: number;
  chapterSlug: string;
}

const ChapterNumberUpdate: React.FC<ChapterNumberUpdateProps> = ({
  initialNumber,
  chapterSlug,
}) => {
  const [chapterNumber, setChapterNumber] = useState(initialNumber);

  const { mutate: updateChapter, isLoading } = useUpdateChapter(chapterSlug);

  const handleUpdateClick = () => {
    updateChapter({
      number: chapterNumber,
    });
  };

  return (
    <div className="space-y-4">
      <ChapterNumberUpload
        onChange={setChapterNumber}
        inputProps={{ defaultValue: initialNumber }}
      />

      <Button
        isLoading={isLoading}
        className="ml-auto"
        primary
        onClick={handleUpdateClick}
      >
        Update
      </Button>
    </div>
  );
};

export default ChapterNumberUpdate;
