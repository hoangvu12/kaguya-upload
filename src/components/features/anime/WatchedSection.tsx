import WatchedSwiper from "@/components/features/anime/WatchedSwiper";
import Section from "@/components/shared/Section";
import WatchedSwiperSkeleton from "@/components/skeletons/WatchedSwiperSkeleton";
import useWatched from "@/hooks/useWatched";
import { getTitle } from "@/utils/data";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import React from "react";
import { BrowserView, MobileOnlyView } from "react-device-detect";
import EpisodeCard from "./EpisodeCard";
import { useAtomValue } from "jotai";
import { titleTypeAtom } from "@/components/shared/TitleSwitcher";

const WatchedSection = () => {
  const { data, isLoading, isError } = useWatched();
  const { t } = useTranslation("anime_home");
  const titleType = useAtomValue(titleTypeAtom);

  if (isLoading) {
    return <WatchedSwiperSkeleton />;
  }

  if (!data?.length || isError) {
    return null;
  }

  return (
    <Section
      href="/recently-watched"
      className="relative"
      title={t("recently_watched")}
    >
      {/* <Link href={"/recently-watched"}>
        <a className="text-lg font-semibold absolute -top-0 right-0 p-[inherit] hover:underline hover:underline-offset-4 mr-32">
          See all
        </a>
      </Link> */}

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
        {data.map(({ media, episode, time, sourceId }) => (
          <div className="w-full flex-none snap-center" key={media.id}>
            <Link href={`/anime/watch/${media.id}/${sourceId}/${episode.id}`}>
              <a>
                <EpisodeCard
                  episode={{
                    ...episode,
                    thumbnail: media.bannerImage || media.coverImage.extraLarge,
                  }}
                  title={getTitle(media, titleType)}
                  duration={(media?.duration || 0) * 60}
                  watchedTime={time}
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
