import { WatchPlayerProps } from "@/components/features/anime/WatchPlayer";
import Button from "@/components/shared/Button";
import Description from "@/components/shared/Description";
import DetailsSection from "@/components/shared/DetailsSection";
import Head from "@/components/shared/Head";
import HorizontalCard from "@/components/shared/HorizontalCard";
import Loading from "@/components/shared/Loading";
import Portal from "@/components/shared/Portal";
import Section from "@/components/shared/Section";
import { useGlobalPlayer } from "@/contexts/GlobalPlayerContext";
import useDevice from "@/hooks/useDevice";
import useEventListener from "@/hooks/useEventListener";
import {
  fetchSource,
  getQueryKey,
  useFetchSource,
} from "@/hooks/useFetchSource";
import useSavedWatched from "@/hooks/useSavedWatched";
import useSaveWatched from "@/hooks/useSaveWatched";
import { Episode } from "@/types";
import { Media } from "@/types/anilist";
import { parseNumberFromString } from "@/utils";
import { getDescription, getTitle, sortMediaUnit } from "@/utils/data";
import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { isMobileOnly } from "react-device-detect";
import { useQueryClient } from "react-query";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { toast } from "react-toastify";
import Banner from "../ads/Banner";
import Comments from "../comment/Comments";
import MediaDetails from "../upload/MediaDetails";
import ErrorMessage from "./ErrorMessage";
import LocaleEpisodeSelector from "./Player/LocaleEpisodeSelector";

const WatchPlayer = dynamic(
  () => import("@/components/features/anime/WatchPlayer"),
  {
    ssr: false,
  }
);

const blankVideo = [
  {
    file: "https://cdn.plyr.io/static/blank.mp4",
  },
];

const ForwardRefPlayer = React.memo(
  React.forwardRef<HTMLVideoElement, WatchPlayerProps>((props, ref) => (
    <WatchPlayer {...props} videoRef={ref} />
  ))
);

ForwardRefPlayer.displayName = "ForwardRefPlayer";

interface WatchPageProps {
  episodes: Episode[];
  media: Media;
}

const WatchPage: NextPage<WatchPageProps> = ({ episodes, media: anime }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const { isMobile } = useDevice();
  const [showInfoOverlay, setShowInfoOverlay] = useState(false);
  const [showWatchedOverlay, setShowWatchedOverlay] = useState(false);
  const [declinedRewatch, setDeclinedRewatch] = useState(false);
  const [videoLoadError, setVideoLoadError] = useState("");

  const showInfoTimeout = useRef<NodeJS.Timeout>(null);
  const saveWatchedInterval = useRef<NodeJS.Timer>(null);
  const saveWatchedMutation = useSaveWatched();
  const { t } = useTranslation("anime_watch");
  const queryClient = useQueryClient();

  const { params } = router.query;

  useEventListener("visibilitychange", () => {
    if (isMobile) return;

    if (showInfoTimeout.current) {
      clearTimeout(showInfoTimeout.current);
    }

    if (!document.hidden) return;

    showInfoTimeout.current = setTimeout(() => {
      setShowInfoOverlay(true);
    }, 5000);
  });

  const sortedEpisodes = useMemo(
    () => sortMediaUnit(episodes || []),
    [episodes]
  );

  const [
    animeId,
    sourceId = sortedEpisodes[0].sourceId,
    episodeId = sortedEpisodes[0].sourceEpisodeId,
  ] = params as string[];

  const {
    data: watchedEpisodeData,
    isLoading: isSavedDataLoading,
    isError: isSavedDataError,
    refetch: refetchWatchedData,
  } = useSavedWatched(Number(animeId));

  const watchedEpisode = useMemo(
    () =>
      isSavedDataError
        ? null
        : sortedEpisodes.find(
            (episode) =>
              episode.sourceEpisodeId ===
              watchedEpisodeData?.episode?.sourceEpisodeId
          ),
    [
      isSavedDataError,
      sortedEpisodes,
      watchedEpisodeData?.episode?.sourceEpisodeId,
    ]
  );

  const sourceEpisodes = useMemo(
    () => episodes.filter((episode) => episode.sourceId === sourceId),
    [episodes, sourceId]
  );

  const currentEpisode = useMemo(() => {
    const episode = sourceEpisodes.find(
      (episode) => episode.sourceEpisodeId === episodeId
    );

    if (!episode) {
      toast.error(
        "The requested episode was not found. It's either deleted or doesn't exist."
      );

      return sourceEpisodes[0] || episodes[0];
    }

    return episode;
  }, [sourceEpisodes, episodeId, episodes]);

  const sectionEpisodes = useMemo(
    () =>
      sourceEpisodes.filter(
        (episode) => episode.section === currentEpisode?.section
      ),
    [currentEpisode?.section, sourceEpisodes]
  );

  const currentSectionEpisodeIndex = useMemo(
    () =>
      sectionEpisodes.findIndex(
        (episode) => episode.sourceEpisodeId === episodeId
      ),
    [episodeId, sectionEpisodes]
  );

  const currentEpisodeIndex = useMemo(
    () =>
      sourceEpisodes.findIndex(
        (episode) => episode.sourceEpisodeId === episodeId
      ),
    [episodeId, sourceEpisodes]
  );

  const nextEpisode = useMemo(
    () =>
      sectionEpisodes[currentSectionEpisodeIndex + 1] ||
      sourceEpisodes[currentEpisodeIndex + 1],
    [
      currentEpisodeIndex,
      currentSectionEpisodeIndex,
      sectionEpisodes,
      sourceEpisodes,
    ]
  );

  const handleNavigateEpisode = useCallback(
    (episode: Episode) => {
      if (!episode) return;

      router.replace(
        `/anime/watch/${animeId}/${episode.sourceId}/${episode.sourceEpisodeId}`,
        null,
        {
          shallow: true,
        }
      );
    },
    [animeId, router]
  );

  const { data, isLoading, isError, error } = useFetchSource(currentEpisode);

  // Show watched overlay
  useEffect(() => {
    if (!currentEpisode.sourceEpisodeId) return;

    if (
      !watchedEpisode ||
      isSavedDataLoading ||
      isSavedDataError ||
      declinedRewatch
    )
      return;

    if (currentEpisode.episodeNumber >= watchedEpisode?.episodeNumber) {
      setDeclinedRewatch(true);

      return;
    }

    setShowWatchedOverlay(true);
  }, [
    currentEpisode?.episodeNumber,
    currentEpisode?.sourceEpisodeId,
    currentEpisode?.title,
    declinedRewatch,
    isSavedDataError,
    isSavedDataLoading,
    watchedEpisode,
  ]);

  useEffect(() => {
    const videoEl = videoRef.current;

    if (!videoEl) return;

    const handleSaveTime = () => {
      if (saveWatchedInterval.current) {
        clearInterval(saveWatchedInterval.current);
      }
      saveWatchedInterval.current = setInterval(() => {
        saveWatchedMutation.mutate({
          media_id: Number(animeId),
          episode_id: `${currentEpisode.sourceId}-${currentEpisode.sourceEpisodeId}`,
          watched_time: videoRef.current?.currentTime,
        });
      }, 30000);
    };

    videoEl.addEventListener("canplay", handleSaveTime);

    return () => {
      clearInterval(saveWatchedInterval.current);
      videoEl.removeEventListener("canplay", handleSaveTime);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animeId, currentEpisode, videoRef.current]);

  useEffect(() => {
    const videoEl = videoRef.current;

    if (!videoEl) return;

    const videoNotLoadedTimeout = setTimeout(() => {
      setVideoLoadError("Video cannot be loaded (Timeout: 30 seconds)");
    }, 30000);

    const handleVideoTimeUpdate = () => {
      clearTimeout(videoNotLoadedTimeout);

      setVideoLoadError(null);
    };

    videoEl.addEventListener("timeupdate", handleVideoTimeUpdate, {
      once: true,
    });

    return () => {
      videoEl.removeEventListener("timeupdate", handleVideoTimeUpdate);

      clearTimeout(videoNotLoadedTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoRef.current]);

  useEffect(() => {
    const videoEl = videoRef.current;

    if (!videoEl) return;

    if (!watchedEpisodeData?.watchedTime) return;

    if (currentEpisode?.episodeNumber === null) return;

    if (currentEpisode.episodeNumber !== watchedEpisode.episodeNumber) return;

    const handleCanPlay = () => {
      const handleVideoPlay = () => {
        setTimeout(() => {
          videoEl.currentTime = watchedEpisodeData.watchedTime;
        }, 1000);

        videoEl.removeEventListener("timeupdate", handleVideoPlay);
      };

      // Just in case the video is already played.
      videoEl.addEventListener("timeupdate", handleVideoPlay);
    };

    videoEl.addEventListener("loadedmetadata", handleCanPlay, { once: true });

    return () => {
      videoEl.removeEventListener("loadedmetadata", handleCanPlay);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedEpisodeData, currentEpisode?.slug, videoRef.current]);

  useEffect(() => {
    if (!videoRef.current) return;
    if (!nextEpisode) return;

    let isPrefetched = false;

    const videoEl = videoRef.current;

    const handleVideoTimeUpdate = () => {
      // check if 80% of the video has been watched
      if (videoEl.currentTime / videoEl.duration < 0.8) return;
      if (isPrefetched) return;

      isPrefetched = true;

      queryClient.prefetchQuery(getQueryKey(nextEpisode), () =>
        fetchSource(nextEpisode, router.locale)
      );
    };

    videoEl.addEventListener("timeupdate", handleVideoTimeUpdate);

    return () => {
      videoEl.removeEventListener("timeupdate", handleVideoTimeUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextEpisode, queryClient, router.locale, videoRef.current]);

  // Refetch watched data when episode changes
  useEffect(() => {
    refetchWatchedData();
  }, [currentEpisode.slug, refetchWatchedData]);

  const title = useMemo(
    () => getTitle(anime, router.locale),
    [anime, router.locale]
  );
  const description = useMemo(
    () => getDescription(anime, router.locale),
    [anime, router.locale]
  );

  const sources = useMemo(
    () => (!data?.sources?.length ? blankVideo : data.sources),
    [data?.sources]
  );

  const subtitles = useMemo(
    () => (!data?.subtitles?.length ? [] : data.subtitles),
    [data?.subtitles]
  );

  const fonts = useMemo(
    () => (!data?.fonts?.length ? [] : data.fonts),
    [data?.fonts]
  );

  useGlobalPlayer({
    playerState: {
      ref: videoRef,
      sources,
      subtitles,
      fonts,
      thumbnail: data?.thumbnail,
      className: "object-contain w-full h-full",
    },
    playerProps: {
      anime,
      currentEpisode,
      currentEpisodeIndex,
      episodes: sortedEpisodes,
      setEpisode: handleNavigateEpisode,
      sourceId,
      sources,
    },
  });

  useEffect(() => {
    if (!anime) return;

    const syncDataScript = document.querySelector("#syncData");

    syncDataScript.textContent = JSON.stringify({
      title: anime.title.userPreferred,
      aniId: Number(animeId),
      episode: parseNumberFromString(currentEpisode.name),
      id: animeId,
      nextEpUrl: nextEpisode
        ? `/anime/watch/${animeId}/${nextEpisode.sourceId}/${nextEpisode.sourceEpisodeId}`
        : null,
    });
  }, [anime, animeId, currentEpisode.name, nextEpisode]);

  return (
    <React.Fragment>
      <Head
        title={`${title} (${currentEpisode.name}) - Kaguya`}
        description={`${description}. Watch ${title} online for free.`}
        image={anime.bannerImage}
      />

      <Section className="py-4 md:py-8 flex flex-col md:flex-row gap-8 w-full h-full bg-background-900">
        <div className="md:w-2/3 space-y-8">
          <DetailsSection title={t("episodes_section")}>
            <div className="bg-background-900 p-4 md:p-8">
              <LocaleEpisodeSelector
                mediaId={anime.id}
                media={anime}
                episodes={episodes}
                activeEpisode={currentEpisode}
                episodeLinkProps={{ shallow: true, replace: true }}
              />
            </div>
          </DetailsSection>

          <div className="w-full overflow-hidden">
            <Banner
              width="100%"
              refresh
              desktop="970x250"
              mobile="300x250"
              type="atf"
            />
          </div>

          <DetailsSection className="w-full" title={t("info_section")}>
            <MediaDetails
              media={anime}
              className="!bg-background-900 !p-4 md:!p-8"
            />
          </DetailsSection>

          {isMobileOnly && (
            <Banner refresh desktop="300x250" mobile="320x100" type="middle" />
          )}

          <DetailsSection title={t("comments_section")}>
            <Comments topic={`anime-${anime.id}`} />
          </DetailsSection>
        </div>

        <div className="md:w-1/3">
          {!isMobileOnly && (
            <Banner refresh desktop="300x250" mobile="300x250" type="atf" />
          )}

          <Tabs selectedTabClassName="!bg-primary-500 hover:bg-primary-500">
            <TabList className="mb-4 flex overflow-x-auto w-full items-center gap-2">
              <Tab className="px-3 py-2 bg-background-600 hover:bg-white/20 transition duration-300 rounded-md cursor-pointer">
                {t("relations_section")}
              </Tab>
              <Tab className="px-3 py-2 bg-background-600 hover:bg-white/20 transition duration-300 rounded-md cursor-pointer">
                {t("recommendations_section")}
              </Tab>
            </TabList>

            <TabPanel>
              {!anime.relations.nodes.length && (
                <p className="block text-center text-white/60">
                  No relations found
                </p>
              )}

              {anime.relations.nodes.map((relation) => (
                <HorizontalCard key={relation.id} data={relation} />
              ))}
            </TabPanel>

            <TabPanel>
              {!anime.recommendations.nodes.length && (
                <p className="block text-center text-white/60">
                  No recommendations found
                </p>
              )}

              {anime.recommendations.nodes.map((recommendation) => (
                <HorizontalCard
                  key={recommendation.id}
                  data={recommendation.mediaRecommendation}
                />
              ))}
            </TabPanel>
          </Tabs>
        </div>
      </Section>

      {isLoading && (
        <Portal retryInterval={1000} selector=".netplayer-container">
          <Loading />
        </Portal>
      )}

      {isError ? (
        <ErrorMessage
          errorMessage={error?.response?.data?.error || error.message}
        />
      ) : (
        !isLoading &&
        !data?.sources?.length && (
          <ErrorMessage errorMessage={"Failed to extract streams"} />
        )
      )}

      {videoLoadError && <ErrorMessage errorMessage={videoLoadError} />}

      {showWatchedOverlay && !declinedRewatch && (
        <Portal selector=".netplayer-container">
          <div
            className="absolute inset-0 z-40 bg-black/70"
            onClick={() => {
              setShowWatchedOverlay(false);
              setDeclinedRewatch(true);
            }}
          />

          <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 z-50 w-2/3 p-8 rounded-md bg-background-900">
            <h1 className="text-4xl font-bold mb-4">
              {t("rewatch_heading", { episodeName: watchedEpisode.name })}
            </h1>
            <p className="">
              {t("rewatch_description", { episodeName: watchedEpisode.name })}
            </p>
            <p className="mb-4">
              {t("rewatch_question", { episodeName: watchedEpisode.name })}
            </p>
            <div className="flex items-center justify-end space-x-4">
              <Button
                onClick={() => {
                  setShowWatchedOverlay(false), setDeclinedRewatch(true);
                }}
                className="!bg-transparent hover:!bg-white/20 transition duration-300"
              >
                <p>{t("rewatch_no")}</p>
              </Button>
              <Button
                onClick={() =>
                  handleNavigateEpisode(watchedEpisodeData?.episode)
                }
                primary
              >
                <p>{t("rewatch_yes")}</p>
              </Button>
            </div>
          </div>
        </Portal>
      )}
    </React.Fragment>
  );
};

export default WatchPage;
