import Portal from "@/components/shared/Portal";
import {
  currentServerAtom,
  isBackgroundAtom,
  playerPropsAtom,
  playerStateAtom,
} from "@/contexts/GlobalPlayerContext";
import useHistory from "@/hooks/useHistory";
import useWindowSize from "@/hooks/useWindowSize";
import { parseNumberFromString } from "@/utils";
import { getEpisodeTitle, getTitle } from "@/utils/data";
import classNames from "classnames";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { selectAtom } from "jotai/utils";
import { ControlButton, TimeIndicator, useInteract, useVideo } from "netplayer";
import { useRouter } from "next/router";
import React, { useMemo, useState } from "react";
import { AiOutlineClose, AiOutlineExpandAlt } from "react-icons/ai";
import { BsArrowLeft } from "react-icons/bs";
import Player, { PlayerProps } from "./Player";
import Controls from "./Player/Controls";
import DesktopServerSelector from "./Player/DesktopServerSelector";
import EpisodesButton from "./Player/EpisodesButton";
import MobileControls from "./Player/MobileControls";
import MobileEpisodesButton from "./Player/MobileEpisodesButton";
import MobileNextEpisode from "./Player/MobileNextEpisode";
import MobileOverlay from "./Player/MobileOverlay";
import MobileServerSelector from "./Player/MobileServerSelector";
import NextEpisodeButton from "./Player/NextEpisodeButton";
import Overlay from "./Player/Overlay";
import ProgressSlider from "./Player/ProgressSlider";
import TimestampSkipButton from "./Player/TimestampSkipButton";
import EpisodeSelector from "./EpisodeSelector";
import { titleTypeAtom } from "@/components/shared/TitleSwitcher";

export interface WatchPlayerProps extends PlayerProps {
  videoRef?: React.ForwardedRef<HTMLVideoElement>;
}

const setEpisodeAtom = selectAtom(playerPropsAtom, (data) => data?.setEpisode);
const episodesAtom = selectAtom(playerPropsAtom, (data) => data?.episodes);
const currentEpisodeIndexAtom = selectAtom(
  playerPropsAtom,
  (data) => data?.currentEpisodeIndex
);
const sourceIdAtom = selectAtom(playerPropsAtom, (data) => data?.sourceId);
const animeAtom = selectAtom(playerPropsAtom, (data) => data?.anime);
const currentEpisodeAtom = selectAtom(
  playerPropsAtom,
  (data) => data?.currentEpisode
);
const serversAtom = selectAtom(playerPropsAtom, (data) => data?.servers);

const PlayerControls = React.memo(() => {
  const isBackground = useAtomValue(isBackgroundAtom);
  const setEpisode = useAtomValue(setEpisodeAtom);
  const episodes = useAtomValue(episodesAtom);
  const currentEpisodeIndex = useAtomValue(currentEpisodeIndexAtom);
  const anime = useAtomValue(animeAtom);
  const currentEpisode = useAtomValue(currentEpisodeAtom);
  const servers = useAtomValue(serversAtom);
  const sourceId = useAtomValue(sourceIdAtom);
  const [currentServer, setCurrentServer] = useAtom(currentServerAtom);

  const { isInteracting } = useInteract();

  const sectionEpisodes = React.useMemo(
    () =>
      episodes.filter((episode) => episode.section === currentEpisode.section),
    [currentEpisode.section, episodes]
  );

  const currentSectionEpisodeIndex = React.useMemo(
    () =>
      sectionEpisodes.findIndex((episode) => episode.id === currentEpisode.id),
    [currentEpisode.id, sectionEpisodes]
  );

  const nextEpisode = React.useMemo(
    () =>
      sectionEpisodes[currentSectionEpisodeIndex + 1] ||
      episodes[currentEpisodeIndex + 1],
    [currentEpisodeIndex, currentSectionEpisodeIndex, sectionEpisodes, episodes]
  );

  return !isBackground ? (
    <Controls
      rightControlsSlot={
        <React.Fragment>
          {currentSectionEpisodeIndex < sectionEpisodes.length - 1 && (
            <NextEpisodeButton onClick={() => setEpisode(nextEpisode)} />
          )}

          {anime?.id && (
            <EpisodesButton>
              <div className="w-[70vw] overflow-hidden bg-background-900 p-4">
                <EpisodeSelector
                  media={anime}
                  episodes={episodes}
                  sourceId={sourceId}
                  activeEpisode={currentEpisode}
                  episodeLinkProps={{ shallow: true, replace: true }}
                />
              </div>
            </EpisodesButton>
          )}

          {servers?.length > 1 && (
            <DesktopServerSelector
              onServerChange={setCurrentServer}
              activeServer={currentServer}
              servers={servers}
            />
          )}
        </React.Fragment>
      }
    />
  ) : (
    <div className="space-y-2">
      {isInteracting && (
        <div className="px-4">
          <TimeIndicator />
        </div>
      )}

      <ProgressSlider />
    </div>
  );
});

PlayerControls.displayName = "PlayerControls";

const PlayerMobileControls = React.memo(() => {
  const isBackground = useAtomValue(isBackgroundAtom);

  const setEpisode = useAtomValue(setEpisodeAtom);
  const episodes = useAtomValue(episodesAtom);
  const currentEpisodeIndex = useAtomValue(currentEpisodeIndexAtom);
  const sourceId = useAtomValue(sourceIdAtom);
  const anime = useAtomValue(animeAtom);
  const currentEpisode = useAtomValue(currentEpisodeAtom);

  const sectionEpisodes = React.useMemo(
    () =>
      episodes.filter((episode) => episode.section === currentEpisode.section),
    [currentEpisode.section, episodes]
  );

  const currentSectionEpisodeIndex = React.useMemo(
    () =>
      sectionEpisodes.findIndex((episode) => episode.id === currentEpisode.id),
    [currentEpisode.id, sectionEpisodes]
  );

  const nextEpisode = React.useMemo(
    () =>
      sectionEpisodes[currentSectionEpisodeIndex + 1] ||
      episodes[currentEpisodeIndex + 1],
    [currentEpisodeIndex, currentSectionEpisodeIndex, sectionEpisodes, episodes]
  );

  return !isBackground ? (
    <MobileControls
      controlsSlot={
        <React.Fragment>
          <MobileEpisodesButton>
            {(isOpen, setIsOpen) =>
              isOpen && (
                <div
                  className={classNames(
                    "fixed inset-0 z-[9999] flex w-full flex-col justify-center bg-background overflow-y-scroll"
                  )}
                >
                  <AiOutlineClose
                    className="absolute left-3 top-3 h-8 w-8 cursor-pointer transition duration-300 hover:text-gray-200"
                    onClick={() => setIsOpen(false)}
                  />

                  {anime?.id && (
                    <div className="w-full h-full px-4">
                      <div className="mt-16">
                        <EpisodeSelector
                          media={anime}
                          episodes={episodes}
                          sourceId={sourceId}
                          activeEpisode={currentEpisode}
                          episodeLinkProps={{ shallow: true, replace: true }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )
            }
          </MobileEpisodesButton>

          {currentSectionEpisodeIndex < sectionEpisodes.length - 1 && (
            <MobileNextEpisode onClick={() => setEpisode(nextEpisode)} />
          )}
        </React.Fragment>
      }
    />
  ) : null;
});

PlayerMobileControls.displayName = "PlayerMobileControls";

const PlayerOverlay = React.memo(() => {
  const { back } = useHistory();
  const { push, locale } = useRouter();
  const { isInteracting } = useInteract();

  const isBackground = useAtomValue(isBackgroundAtom);
  const setPlayerState = useSetAtom(playerStateAtom);
  const anime = useAtomValue(animeAtom);
  const currentEpisode = useAtomValue(currentEpisodeAtom);
  const sourceId = useAtomValue(sourceIdAtom);

  const episodeTitle = getEpisodeTitle(currentEpisode.translations, {
    locale,
    fallback: currentEpisode.title,
  });

  const titleType = useAtomValue(titleTypeAtom);

  const title = getTitle(anime, titleType);

  return (
    <Overlay>
      {isBackground ? (
        <MobileOverlay>
          <div className="flex items-center gap-2 absolute top-4 left-4">
            <div className="w-8 h-8">
              <ControlButton
                className={classNames(
                  isInteracting ? "visible opacity-100" : "invisible opacity-0"
                )}
                onClick={() =>
                  push(
                    `/anime/watch/${anime?.id}/${sourceId}/${currentEpisode.id}`
                  )
                }
                tooltip="Expand"
              >
                <AiOutlineExpandAlt />
              </ControlButton>
            </div>
            <div className="w-8 h-8">
              <ControlButton
                className={classNames(
                  isInteracting ? "visible opacity-100" : "invisible opacity-0"
                )}
                onClick={() => setPlayerState(null)}
                tooltip="Exit"
              >
                <AiOutlineClose />
              </ControlButton>
            </div>
          </div>
        </MobileOverlay>
      ) : (
        <React.Fragment>
          {anime?.idMal && (
            <TimestampSkipButton
              episode={parseNumberFromString(currentEpisode.number)}
              malId={anime.idMal}
            />
          )}

          <div
            className={classNames(
              "transition duration-300 absolute left-0 top-0 h-24 w-full bg-gradient-to-b from-black/80 via-black/40   to-transparent",
              isInteracting ? "visible opacity-100" : "invisible opacity-0"
            )}
          ></div>

          <div
            className={classNames(
              "transition duration-300 absolute top-4 left-28 space-y-1 w-96 max-w-[70vw]",
              isInteracting ? "visible opacity-100" : "invisible opacity-0"
            )}
          >
            <p className="font-semibold text-xl line-clamp-1">
              {currentEpisode.number} {episodeTitle && `- ${episodeTitle}`}
            </p>

            <p className="text-gray-100 text-lg line-clamp-1">{title}</p>
          </div>

          <BsArrowLeft
            className={classNames(
              "transition duration-300 absolute top-4 left-10 h-10 w-10 cursor-pointer hover:text-gray-200",
              isInteracting ? "visible opacity-100" : "invisible opacity-0"
            )}
            onClick={back}
          />
        </React.Fragment>
      )}
    </Overlay>
  );
});

PlayerOverlay.displayName = "PlayerOverlay";

const PlayerMobileOverlay = React.memo(() => {
  const { back } = useHistory();
  const { videoEl } = useVideo();
  const { isInteracting } = useInteract();
  const { locale } = useRouter();

  const [videoSize, setVideoSize] = useState({ width: 0, height: 0 });
  const { width: windowWidth } = useWindowSize();

  const isBackground = useAtomValue(isBackgroundAtom);
  const anime = useAtomValue(animeAtom);
  const currentEpisode = useAtomValue(currentEpisodeAtom);
  const titleType = useAtomValue(titleTypeAtom);

  const title = getTitle(anime, titleType);
  const episodeTitle = getEpisodeTitle(currentEpisode.translations, {
    locale,
    fallback: currentEpisode.title,
  });

  const sourceId = useAtomValue(sourceIdAtom);

  const servers = useAtomValue(serversAtom);
  const [currentServer, setCurrentServer] = useAtom(currentServerAtom);

  React.useEffect(() => {
    if (!videoEl) return;

    const handleLoaded = () => {
      setVideoSize({
        width: videoEl.videoWidth,
        height: videoEl.videoHeight,
      });
    };

    videoEl.addEventListener("resize", handleLoaded);

    return () => {
      videoEl.removeEventListener("resize", handleLoaded);
    };
  }, [videoEl]);

  return (
    <React.Fragment>
      <MobileOverlay
        topRightSlot={
          <div className="w-6 h-6">
            {servers?.length > 1 && (
              <MobileServerSelector
                onServerChange={setCurrentServer}
                activeServer={currentServer}
                servers={servers}
              />
            )}
          </div>
        }
      >
        {!isBackground && (
          <React.Fragment>
            <BsArrowLeft
              className={classNames(
                "absolute top-4 left-4 h-8 w-8 cursor-pointer transition-all duration-300 hover:text-gray-200",
                isInteracting ? "visible opacity-100" : "invisible opacity-0"
              )}
              onClick={back}
            />

            {windowWidth >= 640 && (
              <React.Fragment>
                <div className="absolute top-4 left-16 space-y-1 w-96 max-w-[70vw]">
                  <p className="font-semibold text-bas line-clamp-1">
                    {currentEpisode.title} {episodeTitle && `- ${episodeTitle}`}
                  </p>

                  <p className="text-gray-300 text-sm line-clamp-1">{title}</p>
                </div>

                <div className="text-right absolute top-16 right-4">
                  <p className="font-semibold text-base">{sourceId}</p>

                  {currentServer && (
                    <p className="text-sm text-gray-100">
                      {currentServer.name}
                    </p>
                  )}

                  {videoSize.width !== 0 && videoSize.height !== 0 && (
                    <p className="text-gray-300 text-sm">
                      {videoSize.width} x {videoSize.height}
                    </p>
                  )}
                </div>
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </MobileOverlay>

      {anime?.idMal && (
        <Portal retryInterval={1000} selector=".netplayer-container">
          <TimestampSkipButton
            episode={parseNumberFromString(currentEpisode.number)}
            malId={anime.idMal}
          />
        </Portal>
      )}
    </React.Fragment>
  );
});

PlayerMobileOverlay.displayName = "PlayerMobileOverlay";

const WatchPlayer: React.FC<WatchPlayerProps> = ({ videoRef, ...props }) => {
  const setEpisode = useAtomValue(setEpisodeAtom);
  const episodes = useAtomValue(episodesAtom);
  const currentEpisodeIndex = useAtomValue(currentEpisodeIndexAtom);
  const currentEpisode = useAtomValue(currentEpisodeAtom);

  const sectionEpisodes = React.useMemo(
    () =>
      episodes.filter((episode) => episode.section === currentEpisode.section),
    [currentEpisode.section, episodes]
  );

  const currentSectionEpisodeIndex = React.useMemo(
    () =>
      sectionEpisodes.findIndex((episode) => episode.id === currentEpisode.id),
    [currentEpisode.id, sectionEpisodes]
  );

  const nextEpisode = React.useMemo(
    () =>
      sectionEpisodes[currentSectionEpisodeIndex + 1] ||
      episodes[currentEpisodeIndex + 1],
    [currentEpisodeIndex, currentSectionEpisodeIndex, sectionEpisodes, episodes]
  );

  const hotkeys = useMemo(
    () => [
      {
        fn: () => {
          if (currentSectionEpisodeIndex < sectionEpisodes.length - 1) {
            setEpisode(nextEpisode);
          }
        },
        hotKey: "shift+n",
        name: "next-episode",
      },
    ],
    [
      currentSectionEpisodeIndex,
      nextEpisode,
      sectionEpisodes.length,
      setEpisode,
    ]
  );

  const components = useMemo(
    () => ({
      Controls: PlayerControls,
      MobileControls: PlayerMobileControls,
      Overlay: PlayerOverlay,
      MobileOverlay: PlayerMobileOverlay,
    }),
    []
  );

  return (
    <Player
      ref={videoRef}
      components={components}
      hotkeys={hotkeys}
      autoPlay
      {...props}
    />
  );
};

WatchPlayer.displayName = "WatchPlayer";

export default React.memo(WatchPlayer);
