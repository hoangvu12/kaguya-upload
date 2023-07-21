import EpisodeCard from "@/components/features/anime/EpisodeCard";
import Link from "@/components/shared/Link";
import Swiper, { SwiperProps, SwiperSlide } from "@/components/shared/Swiper";
import { WatchedEpisodesWithMedia } from "@/hooks/useWatched";
import { getTitle } from "@/utils/data";
import React from "react";

interface WatchedSwiperProps extends SwiperProps {
  data: WatchedEpisodesWithMedia[];
}

const WatchedSwiper: React.FC<WatchedSwiperProps> = ({ data, ...props }) => {
  return (
    <Swiper speed={500} {...props}>
      {data.map(({ media, episode, time, sourceId }, index) => {
        return (
          <SwiperSlide key={index}>
            <Link href={`/anime/watch/${media.id}/${sourceId}/${episode.id}`}>
              <a>
                <EpisodeCard
                  episode={{
                    ...episode,
                    thumbnail: media.bannerImage || media.coverImage.extraLarge,
                  }}
                  title={getTitle(media)}
                  duration={(media?.duration || 0) * 60}
                  watchedTime={time}
                />
              </a>
            </Link>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default React.memo(WatchedSwiper);
