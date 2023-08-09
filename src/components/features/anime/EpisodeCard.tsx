import Image from "@/components/shared/Image";
import { Media } from "@/types/anilist";
import { Episode } from "@/types/core";
import classNames from "classnames";
import { useRouter } from "next/router";
import React, { useMemo } from "react";

interface EpisodeCardProps {
  episode: Episode;
  isActive?: boolean;
  title?: string;
  watchedTime?: number;
  duration?: number;
  media?: Media;
  displayMediaTitle?: boolean;
}

const EpisodeCard: React.FC<EpisodeCardProps> = ({
  episode,
  isActive,
  title,
  watchedTime,
  duration = 0,
  media,
  displayMediaTitle = true,
  ...props
}) => {
  const { locale } = useRouter();

  const watchProgressPercent = useMemo(() => {
    if (duration === 0) return 0;

    if (duration < watchedTime) return 100;

    return (watchedTime / duration) * 100;
  }, [watchedTime, duration]);

  const episodeTitle = useMemo(() => {
    return episode.title;
  }, [episode.title]);

  const episodeDescription = useMemo(() => {
    return episode.description;
  }, [episode.description]);

  return (
    <div
      title={episodeTitle}
      className="group relative h-40 w-full hover:bg-white/20 cursor-pointer"
      {...props}
    >
      <Image
        src={
          episode?.thumbnail ||
          media.bannerImage ||
          media.coverImage.extraLarge ||
          "/error.png"
        }
        layout="fill"
        alt={episodeTitle}
        objectFit="cover"
        className="group-hover:scale-105 transition duration-300 rounded-md"
      />

      <div className="absolute top-2 left-2 bg-background-400 px-4 py-1 rounded-md font-bold">
        {episode.number}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>

      <div className="w-full absolute bottom-0 p-2 space-y-2">
        <p
          className={classNames(
            "text-sm line-clamp-1 font-semibold leading-none",
            isActive && "text-primary-300"
          )}
        >
          {displayMediaTitle ? title : episodeTitle}
        </p>

        {episodeDescription && (
          <p
            title={episodeDescription}
            className="text-xs line-clamp-1 font-semibold text-gray-300 leading-none"
          >
            {episodeDescription}
          </p>
        )}
      </div>

      {episode.isFiller && (
        <p className="absolute top-0 left-0 bg-primary-500 text-white text-xs font-semibold px-1 rounded-bl-md">
          Filler
        </p>
      )}

      <div
        className="absolute bottom-0 h-1 bg-primary-500"
        style={{ width: `${watchProgressPercent}%` }}
      />
    </div>
  );
};

export default React.memo(EpisodeCard);
