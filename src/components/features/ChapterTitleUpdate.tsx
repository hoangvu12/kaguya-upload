import Button from "@/components/shared/Button";
import useUpdateChapter from "@/hooks/useUpdateChapter";
import React, { useState } from "react";
import ChapterTitleUpload from "./ChapterTitleUpload";

interface ChapterTitleUpdateProps {
  initialTitle?: string;
  chapterSlug: string;
}

const ChapterTitleUpdate: React.FC<ChapterTitleUpdateProps> = ({
  initialTitle,
  chapterSlug,
}) => {
  const [chapterTitle, setChapterTitle] = useState(initialTitle);

  const { mutate: updateChapter, isLoading } = useUpdateChapter(chapterSlug);

  const handleUpdateClick = () => {
    updateChapter({
      title: chapterTitle,
    });
  };

  return (
    <div className="space-y-4">
      <ChapterTitleUpload
        onChange={setChapterTitle}
        inputProps={{ defaultValue: initialTitle }}
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

export default ChapterTitleUpdate;
