import { useUpdateEpisode } from "@/hooks/useUpdateEpisode";
import React, { useState } from "react";
import EpisodeTitleUpload from "./EpisodeTitleUpload";
import { SupabaseEpisode } from "@/types";
import EpisodeDescriptionUpload from "./EpisodeDescriptionUpload";
import EpisodeNumberUpload from "./EpisodeNumberUpload";
import EpisodeThumbnailUpload from "./EpisodeThumbnailUpload";
import { useQuery } from "react-query";
import { createFileFromUrl } from "@/utils";
import Spinner from "../shared/Spinner";
import Button from "../shared/Button";

interface EpisodeUpdateProps {
  initialEpisode: SupabaseEpisode;
}

const EpisodeUpdate: React.FC<EpisodeUpdateProps> = ({ initialEpisode }) => {
  const [episodeTitle, setEpisodeTitle] = useState(initialEpisode.title);
  const [episodeNumber, setEpisodeNumber] = useState<number>(
    initialEpisode.number
  );
  const [episodeThumbnail, setEpisodeThumbnail] = useState(
    initialEpisode.thumbnail
  );
  const [episodeDescription, setEpisodeDescription] = useState(
    initialEpisode.description
  );

  const { data: initialThumbnailFile, isLoading: initialThumbnailFileLoading } =
    useQuery<File>(
      ["uploaded-thumbnail-files", initialEpisode.thumbnail],
      async () => {
        if (!initialEpisode.thumbnail) return null;

        const filename = initialEpisode.thumbnail.split("/").pop();

        return createFileFromUrl(initialEpisode.thumbnail, filename);
      }
    );

  const { mutate: updateEpisode, isLoading: updateLoading } = useUpdateEpisode(
    initialEpisode.slug
  );

  const handleUpdateClick = () => {
    updateEpisode({
      title: episodeTitle,
      number: episodeNumber,
      thumbnail: episodeThumbnail,
      description: episodeDescription,
    });
  };

  return (
    <React.Fragment>
      <div className="flex flex-wrap md:flex-nowrap gap-8 mb-4">
        <div className="w-full md:w-1/3">
          {initialThumbnailFileLoading ? (
            <Spinner />
          ) : (
            <EpisodeThumbnailUpload
              onChange={setEpisodeThumbnail}
              initialThumbnailFile={initialThumbnailFile}
            />
          )}
        </div>
        <div className="w-full md:w-2/3 space-y-4">
          <EpisodeNumberUpload
            inputProps={{ defaultValue: episodeNumber.toString() }}
            onChange={setEpisodeNumber}
          />
          <EpisodeTitleUpload
            inputProps={{ defaultValue: episodeTitle }}
            onChange={setEpisodeTitle}
          />
        </div>
      </div>

      <EpisodeDescriptionUpload
        inputProps={{ defaultValue: episodeDescription }}
        onChange={setEpisodeDescription}
      />

      <Button
        isLoading={updateLoading}
        className="ml-auto mt-4"
        primary
        onClick={handleUpdateClick}
      >
        Update
      </Button>
    </React.Fragment>
  );
};

export default EpisodeUpdate;
