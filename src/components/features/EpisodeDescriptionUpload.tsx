import Input, { InputProps } from "@/components/shared/Input";
import React, { useState } from "react";

interface EpisodeDescriptionUploadProps {
  onChange: (description: string) => void;
  inputProps?: Omit<InputProps, "ref">;
}

const EpisodeDescriptionUpload: React.FC<EpisodeDescriptionUploadProps> = ({
  onChange,
  inputProps,
}) => {
  const [episodeDescription, setEpisodeDescription] = useState("");

  return (
    <div className="space-y-2">
      <label>Description (optional)</label>

      <Input
        placeholder="Because you are so awesome, so you are uploading a new episode!"
        className="px-3 py-2"
        onChange={(e) => {
          const target = e.target as HTMLInputElement;

          setEpisodeDescription(target.value);
        }}
        onBlur={() => {
          onChange?.(episodeDescription);
        }}
        {...inputProps}
      />
    </div>
  );
};

export default EpisodeDescriptionUpload;
