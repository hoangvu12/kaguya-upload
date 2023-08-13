import Input, { InputProps } from "@/components/shared/Input";
import React, { useState } from "react";

interface EpisodeTilteUploadProps {
  onChange: (episodeName: string) => void;
  inputProps?: Omit<InputProps, "ref">;
}

const EpisodeTitleUpload: React.FC<EpisodeTilteUploadProps> = ({
  onChange,
  inputProps,
}) => {
  const [episodeTitle, setEpisodeTitle] = useState("");

  return (
    <div className="space-y-2">
      <label>Title (optional)</label>

      <Input
        placeholder="You are awesome!"
        className="px-3 py-2"
        onChange={(e) => {
          const target = e.target as HTMLInputElement;

          setEpisodeTitle(target.value);
        }}
        onBlur={() => {
          onChange?.(episodeTitle);
        }}
        {...inputProps}
      />
    </div>
  );
};

export default EpisodeTitleUpload;
