import Input, { InputProps } from "@/components/shared/Input";
import React, { useState } from "react";

interface EpisodeNumberUploadProps {
  onChange: (episodeNumber: number) => void;
  inputProps?: Omit<InputProps, "ref">;
}

const EpisodeNumberUpload: React.FC<EpisodeNumberUploadProps> = ({
  onChange,
  inputProps,
}) => {
  const [episodeNumber, setEpisodeNumber] = useState(null);

  return (
    <div className="space-y-2">
      <label>Number (required)</label>

      <Input
        placeholder="1"
        className="px-3 py-2"
        onChange={(e) => {
          const target = e.target as HTMLInputElement;

          setEpisodeNumber(Number(target.value));
        }}
        onBlur={() => {
          onChange?.(episodeNumber);
        }}
        {...inputProps}
      />
    </div>
  );
};

export default EpisodeNumberUpload;
