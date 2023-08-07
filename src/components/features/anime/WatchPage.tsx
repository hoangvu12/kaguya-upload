import { WatchPlayerProps } from "@/components/features/anime/WatchPlayer";
import Button from "@/components/shared/Button";
import DetailsSection from "@/components/shared/DetailsSection";
import Head from "@/components/shared/Head";
import HorizontalCard from "@/components/shared/HorizontalCard";
import Loading from "@/components/shared/Loading";
import MediaDetails from "@/components/shared/MediaDetails";
import Portal from "@/components/shared/Portal";
import Section from "@/components/shared/Section";
import {
  currentServerAtom,
  useGlobalPlayer,
} from "@/contexts/GlobalPlayerContext";
import useFetchServers from "@/hooks/useFetchServers";
import { useFetchSource } from "@/hooks/useFetchSource";
import useSaveWatchedData from "@/hooks/useSaveWatchedData";
import useWatchedEpisode from "@/hooks/useWatchedEpisode";
import { Media } from "@/types/anilist";
import { Episode, Video, VideoServer } from "@/types/core";
import { compareTwoObject, parseNumberFromString } from "@/utils";
import { getDescription, getTitle, sortMediaUnit } from "@/utils/data";
import { useAtomValue, useSetAtom } from "jotai";
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
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { toast } from "react-toastify";
import EpisodeSelector from "./EpisodeSelector";
import ErrorMessage from "./ErrorMessage";
import { titleTypeAtom } from "@/components/shared/TitleSwitcher";

const WatchPlayer = dynamic(
  () => import("@/components/features/anime/WatchPlayer"),
  {
    ssr: false,
  }
);

const blankVideo: Video[] = [
  {
    file: {
      url: "https://cdn.plyr.io/static/blank.mp4",
    },
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
  sourceId: string;
}

const WatchPage: NextPage<WatchPageProps> = ({
  episodes,
  media: anime,
  sourceId,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const [showWatchedOverlay, setShowWatchedOverlay] = useState(false);
  const [declinedRewatch, setDeclinedRewatch] = useState(false);
  const [videoLoadError, setVideoLoadError] = useState("");
  const setCurrentServer = useSetAtom(currentServerAtom);

  const saveWatchedInterval = useRef<NodeJS.Timer>(null);
  const saveWatchedMutation = useSaveWatchedData();
  const lastEpisodeServer = useRef<VideoServer>(null);
  const lastEpisodeServers = useRef<VideoServer[]>([]);

  const titleType = useAtomValue(titleTypeAtom);

  const { t } = useTranslation("anime_watch");

  const { params } = router.query;

  const sortedEpisodes = useMemo(
    () => sortMediaUnit(episodes || []),
    [episodes]
  );

  const [animeId, _, episodeId = sortedEpisodes[0].id] = params as string[];

  const {
    data: watchedEpisodeData,
    isLoading: isSavedDataLoading,
    isError: isSavedDataError,
    refetch: refetchWatchedData,
  } = useWatchedEpisode(Number(animeId));

  const watchedEpisode = useMemo(
    () =>
      isSavedDataError
        ? null
        : sortedEpisodes.find(
            (episode) => episode.id === watchedEpisodeData?.episode?.id
          ),
    [isSavedDataError, sortedEpisodes, watchedEpisodeData?.episode?.id]
  );

  const currentEpisode = useMemo(() => {
    const episode = episodes.find((episode) => episode.id === episodeId);

    if (!episode) {
      toast.error(
        "The requested episode was not found. It's either deleted or doesn't exist."
      );

      return episodes[0];
    }

    return episode;
  }, [episodeId, episodes]);

  const sectionEpisodes = useMemo(
    () =>
      episodes.filter((episode) => episode.section === currentEpisode?.section),
    [currentEpisode?.section, episodes]
  );

  const currentSectionEpisodeIndex = useMemo(
    () => sectionEpisodes.findIndex((episode) => episode.id === episodeId),
    [episodeId, sectionEpisodes]
  );

  const currentEpisodeIndex = useMemo(
    () => episodes.findIndex((episode) => episode.id === episodeId),
    [episodeId, episodes]
  );

  const nextEpisode = useMemo(
    () =>
      sectionEpisodes[currentSectionEpisodeIndex + 1] ||
      episodes[currentEpisodeIndex + 1],
    [currentEpisodeIndex, currentSectionEpisodeIndex, episodes, sectionEpisodes]
  );

  const handleNavigateEpisode = useCallback(
    (episode: Episode) => {
      if (!episode) return;

      router.replace(
        `/anime/watch/${animeId}/${sourceId}/${episode.id}`,
        null,
        {
          shallow: true,
        }
      );
    },
    [animeId, router, sourceId]
  );

  const { data: servers, isLoading: isServerLoading } = useFetchServers(
    currentEpisode,
    sourceId
  );

  const currentServer = useAtomValue(currentServerAtom);

  const shouldFetchSource = useMemo(() => {
    if (isServerLoading) return false;

    if (!currentServer) return false;

    if (!lastEpisodeServer.current) return true;

    // When new servers are fetched, the current server will be updated using useEffect
    // but useFetchSource run before useEffect run, that means useFetchSource will use
    // old currentServer, therefore getting wrong sources. Compare current server with
    // old one to see if they are the same
    return compareTwoObject(lastEpisodeServer.current, currentServer);
  }, [currentServer, isServerLoading]);

  const { data, isLoading, isError, error } = useFetchSource(
    currentEpisode,
    sourceId,
    currentServer,
    {
      enabled: shouldFetchSource,
    }
  );

  // Set default server when servers are fetched
  useEffect(() => {
    if (isServerLoading) {
      setCurrentServer(null);
    } else if (servers?.[0]) {
      setCurrentServer(servers[0]);
    }
  }, [servers, setCurrentServer, isServerLoading]);

  useEffect(() => {
    // If last episode servers and current servers are not the same
    // that mean user just changed episode
    // currentServer right now is one of last episode servers
    if (!compareTwoObject(lastEpisodeServers.current, servers)) {
      lastEpisodeServer.current = currentServer;
    }

    lastEpisodeServers.current = servers;
  }, [currentServer, servers]);

  // Refetch watched data whenever load new episodes
  useEffect(() => {
    refetchWatchedData();
  }, [refetchWatchedData]);

  // // Show watched overlay
  useEffect(() => {
    if (!currentEpisode.id) return;

    if (
      !watchedEpisode ||
      isSavedDataLoading ||
      isSavedDataError ||
      declinedRewatch
    )
      return;

    if (
      parseNumberFromString(currentEpisode.number) >=
      parseNumberFromString(watchedEpisode?.number)
    ) {
      setDeclinedRewatch(true);

      return;
    }

    setShowWatchedOverlay(true);
  }, [
    currentEpisode.id,
    currentEpisode.number,
    currentEpisode.title,
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
          episode: currentEpisode,
          mediaId: Number(animeId),
          time: videoRef.current?.currentTime,
          sourceId,
        });
      }, 30000);
    };

    videoEl.addEventListener("canplay", handleSaveTime);

    return () => {
      clearInterval(saveWatchedInterval.current);
      videoEl.removeEventListener("canplay", handleSaveTime);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animeId, sourceId, currentEpisode, videoRef.current]);

  useEffect(() => {
    const videoEl = videoRef.current;

    if (!videoEl) return;

    const videoNotLoadedTimeout = setTimeout(() => {
      setVideoLoadError("Video cannot be loaded (Timeout: 30 seconds)");
    }, 30000);

    const handleVideoTimeUpdate = () => {
      videoEl.removeEventListener("timeupdate", handleVideoTimeUpdate);

      clearTimeout(videoNotLoadedTimeout);

      setVideoLoadError(null);
    };

    const handleVideoCanPlay = () => {
      videoEl.addEventListener("timeupdate", handleVideoTimeUpdate, {
        once: true,
      });
    };

    videoEl.addEventListener("canplay", handleVideoCanPlay);

    return () => {
      videoEl.removeEventListener("canplay", handleVideoCanPlay);

      clearTimeout(videoNotLoadedTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoRef.current]);

  useEffect(() => {
    const videoEl = videoRef.current;

    if (!videoEl) return;

    if (!watchedEpisodeData?.time) return;

    const watchedEpisodeNumber = parseNumberFromString(watchedEpisode?.number);
    const currentEpisodeNumber = parseNumberFromString(currentEpisode?.number);

    if (!watchedEpisodeNumber || !currentEpisodeNumber) return;

    if (currentEpisodeNumber !== watchedEpisodeNumber) return;

    const handleCanPlay = () => {
      const handleVideoPlay = () => {
        setTimeout(() => {
          videoEl.currentTime = watchedEpisodeData.time;
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
  }, [watchedEpisodeData, currentEpisode, videoRef.current]);

  // useEffect(() => {
  //   if (!videoRef.current) return;
  //   if (!nextEpisode) return;

  //   let isPrefetched = false;
  //   let shouldNotPrefetch = false;

  //   const videoEl = videoRef.current;

  //   const MINIMUM_VIDEO_TIME = 600; // 10 minutes

  //   const handleVideoTimeUpdate = () => {
  //     if (shouldNotPrefetch) return;

  //     if (videoEl.duration < MINIMUM_VIDEO_TIME) {
  //       shouldNotPrefetch = true;
  //     }

  //     // check if 80% of the video has been watched
  //     if (videoEl.currentTime / videoEl.duration < 0.8) return;
  //     if (isPrefetched) return;

  //     isPrefetched = true;

  //     queryClient.prefetchQuery(getQueryKey(nextEpisode), () =>
  //       fetchSource(nextEpisode, router.locale)
  //     );
  //   };

  //   videoEl.addEventListener("timeupdate", handleVideoTimeUpdate);

  //   return () => {
  //     videoEl.removeEventListener("timeupdate", handleVideoTimeUpdate);
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [nextEpisode, queryClient, router.locale, videoRef.current]);

  // // Refetch watched data when episode changes
  // useEffect(() => {
  //   refetchWatchedData();
  // }, [currentEpisode.slug, refetchWatchedData]);

  const title = useMemo(
    () => getTitle(anime, { titleType, locale: router.locale }),
    [anime, titleType, router.locale]
  );
  const description = useMemo(
    () => getDescription(anime, { locale: router.locale }),
    [anime, router.locale]
  );

  const sources = useMemo(
    () => (!data?.videos?.length ? blankVideo : data.videos),
    [data?.videos]
  );

  const subtitles = useMemo(
    () => (!data?.subtitles?.length ? [] : data.subtitles),
    [data?.subtitles]
  );

  useGlobalPlayer({
    playerState: {
      ref: videoRef,
      sources,
      subtitles,
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
      servers: servers || [],
    },
  });

  useEffect(() => {
    if (!anime) return;

    const syncDataScript = document.querySelector("#syncData");

    syncDataScript.textContent = JSON.stringify({
      title: anime.title.userPreferred,
      aniId: Number(animeId),
      episode: parseNumberFromString(currentEpisode.number),
      id: animeId,
      nextEpUrl: nextEpisode
        ? `/anime/watch/${animeId}/${sourceId}/${nextEpisode.id}`
        : null,
    });
  }, [anime, animeId, currentEpisode.number, nextEpisode, sourceId]);

  useEffect(() => {
    if (isError) {
      setVideoLoadError(error.message);

      return;
    }

    if (!data?.videos) return;

    if (!isLoading && !isServerLoading && !data.videos?.length) {
      setVideoLoadError("Failed to extract streams");

      return;
    }
  }, [data?.videos, error?.message, isError, isLoading, isServerLoading]);

  return (
    <React.Fragment>
      <Head
        title={`${title} (${currentEpisode.number}) - Kaguya`}
        description={`${description}. Watch ${title} online for free.`}
        image={anime.bannerImage}
      />

      <Section className="py-4 md:py-8 flex flex-col md:flex-row gap-8 w-full h-full bg-background-900">
        <div className="md:w-2/3 space-y-8">
          <div className="bg-background-900">
            <EpisodeSelector
              episodes={episodes}
              sourceId={sourceId}
              media={anime}
              watchedEpisode={watchedEpisodeData}
              activeEpisode={currentEpisode}
              episodeLinkProps={{ shallow: true, replace: true }}
            />
          </div>

          <DetailsSection
            className="w-full"
            title={t("info_section", { defaultValue: "Info" })}
          >
            <MediaDetails media={anime} className="!bg-background-900 !p-0" />
          </DetailsSection>
        </div>

        <div className="md:w-1/3">
          <Tabs selectedTabClassName="!bg-primary-500 hover:bg-primary-500">
            <TabList className="mb-4 flex overflow-x-auto w-full items-center gap-2">
              <Tab className="px-3 py-2 bg-background-600 hover:bg-white/20 transition duration-300 rounded-md cursor-pointer">
                {t("relations_section", { defaultValue: "Relations" })}
              </Tab>
              <Tab className="px-3 py-2 bg-background-600 hover:bg-white/20 transition duration-300 rounded-md cursor-pointer">
                {t("recommendations_section", {
                  defaultValue: "Recommendations",
                })}
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

      {(isLoading || isServerLoading) && (
        <Portal retryInterval={1000} selector=".netplayer-container">
          <Loading />
        </Portal>
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
              {t("rewatch_heading", { episodeName: watchedEpisode.number })}
            </h1>
            <p className="">
              {t("rewatch_description", { episodeName: watchedEpisode.number })}
            </p>
            <p className="mb-4">
              {t("rewatch_question", { episodeName: watchedEpisode.number })}
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
