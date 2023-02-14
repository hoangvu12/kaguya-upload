import { Episode } from "@/types";
import React, { useMemo } from "react";
import Image from "@/components/shared/Image";
import { getEpisodeDescription, getEpisodeTitle } from "@/utils/data";
import { useRouter } from "next/router";
import { Media } from "@/types/anilist";

interface EpisodeCardProps {
  episode: Episode;
  isActive?: boolean;
  title?: string;
  watchedTime?: number;
  duration?: number;
  media?: Media;
}

const EpisodeCard: React.FC<EpisodeCardProps> = ({
  episode,
  isActive,
  title,
  watchedTime,
  duration = 0,
  media,
  ...props
}) => {
  const { locale } = useRouter();

  const watchProgressPercent = useMemo(() => {
    if (duration === 0) return 0;

    if (duration < watchedTime) return 100;

    return (watchedTime / duration) * 100;
  }, [watchedTime, duration]);

  const episodeTitle = useMemo(() => {
    return getEpisodeTitle(episode.title, locale);
  }, [episode.title, locale]);

  const episodeDescription = useMemo(() => {
    return getEpisodeDescription(episode.description, locale);
  }, [episode.description, locale]);

  const episodeDisplayTitle = useMemo(() => {
    let displayTitle = episode.name;

    if (
      (episodeTitle || title) &&
      episodeTitle !== displayTitle &&
      title !== displayTitle
    ) {
      displayTitle += ` - ${episodeTitle || title}`;
    }

    return displayTitle;
  }, [episode.name, episodeTitle, title]);

  return (
    <div
      className="relative h-40 w-full hover:bg-white/20 cursor-pointer"
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
        alt={episode.name}
        objectFit="cover"
        className="hover:scale-105 transition duration-300"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>

      <div className="w-full absolute bottom-0 p-2 space-y-2">
        <p className="text-sm line-clamp-1 font-semibold leading-none">
          {episodeDisplayTitle}
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

      <div
        className="absolute bottom-0 h-1 bg-primary-500"
        style={{ width: `${watchProgressPercent}%` }}
      />
    </div>
  );
};

export default React.memo(EpisodeCard);
