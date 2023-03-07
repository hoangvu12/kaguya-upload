import WatchedSwiper from "@/components/features/anime/WatchedSwiper";
import Section from "@/components/shared/Section";
import WatchedSwiperSkeleton from "@/components/skeletons/WatchedSwiperSkeleton";
import useWatched from "@/hooks/useWatched";
import { getTitle } from "@/utils/data";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import React from "react";
import { BrowserView, MobileOnlyView } from "react-device-detect";
import EpisodeCard from "./EpisodeCard";

const WatchedSection = () => {
  const { data, isLoading, isError } = useWatched();
  const { t } = useTranslation("anime_home");
  const { locale } = useRouter();

  if (isLoading) {
    return <WatchedSwiperSkeleton />;
  }

  if (!data?.length || isError) {
    return null;
  }

  return (
    <Section title={t("recently_watched")}>
      <BrowserView renderWithFragment>
        <WatchedSwiper
          data={data}
          slidesPerView={5}
          slidesPerGroup={5}
          breakpoints={{
            1536: {
              slidesPerView: 5,
              slidesPerGroup: 5,
              spaceBetween: 20,
            },
            1280: {
              slidesPerView: 4,
              slidesPerGroup: 4,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              slidesPerGroup: 3,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              slidesPerGroup: 2,
              spaceBetween: 20,
            },
            0: {
              slidesPerView: 1,
              slidesPerGroup: 1,
              spaceBetween: 10,
            },
          }}
        />
      </BrowserView>

      <MobileOnlyView className="flex snap-x snap-mandatory overflow-x-auto no-scrollbar gap-2">
        {data.map(({ media, episode, watchedTime, mediaId }) => (
          <div className="w-full flex-none snap-center" key={mediaId}>
            <Link
              href={`/anime/watch/${media.id}/${episode.sourceId}/${episode.sourceEpisodeId}`}
            >
              <a>
                <EpisodeCard
                  episode={{
                    ...episode,
                    thumbnail: media.bannerImage || media.coverImage.extraLarge,
                  }}
                  title={getTitle(media, locale)}
                  duration={(media?.duration || 0) * 60}
                  watchedTime={watchedTime}
                />
              </a>
            </Link>
          </div>
        ))}
      </MobileOnlyView>
    </Section>
  );
};

export default React.memo(WatchedSection);
