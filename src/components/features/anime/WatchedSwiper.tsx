import EpisodeCard from "@/components/features/anime/EpisodeCard";
import Link from "@/components/shared/Link";
import Swiper, { SwiperProps, SwiperSlide } from "@/components/shared/Swiper";
import { titleTypeAtom } from "@/components/shared/TitleSwitcher";
import { WatchedEpisodesWithMedia } from "@/hooks/useWatched";
import { getTitle } from "@/utils/data";
import { useAtomValue } from "jotai";
import { useRouter } from "next/router";
import React from "react";

interface WatchedSwiperProps extends SwiperProps {
  data: WatchedEpisodesWithMedia[];
}

const WatchedSwiper: React.FC<WatchedSwiperProps> = ({ data, ...props }) => {
  const titleType = useAtomValue(titleTypeAtom);
  const { locale } = useRouter();

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
                  title={getTitle(media, { titleType, locale })}
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
