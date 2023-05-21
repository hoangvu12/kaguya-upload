import { WatchPlayerProps } from "@/components/features/anime/WatchPlayer";
import CircleButton from "@/components/shared/CircleButton";
import useHistory from "@/hooks/useHistory";
import { AnimeServer, Episode, VideoSource } from "@/types";
import { Media } from "@/types/anilist";
import { createProxyUrl } from "@/utils";
import classNames from "classnames";
import {
  AnimatePresence,
  motion,
  MotionStyle,
  useMotionValue,
} from "framer-motion";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useRef } from "react";
import { isMobile, isMobileOnly } from "react-device-detect";
import { AiOutlineClose, AiOutlineExpandAlt } from "react-icons/ai";
import { BsArrowLeft } from "react-icons/bs";
import { toast } from "react-toastify";

export interface WatchPlayerContextProps {
  anime: Media;
  episodes: Episode[];
  currentEpisode: Episode;
  currentEpisodeIndex: number;
  setEpisode: (episode: Episode) => void;
  sourceId: string;
  sources: VideoSource[];
  servers: AnimeServer[];
}

const WatchPlayer = dynamic(
  () => import("@/components/features/anime/WatchPlayer"),
  {
    ssr: false,
  }
);

const MobileServerSelector = dynamic(
  () => import("@/components/features/anime/Player/MobileServerSelector"),
  { ssr: false }
);
const DesktopServerSelector = dynamic(
  () => import("@/components/features/anime/Player/DesktopServerSelector"),
  { ssr: false }
);

interface PlayerProps extends WatchPlayerProps {
  ref?: React.RefObject<HTMLVideoElement>;
}

const ForwardRefPlayer = React.memo(
  React.forwardRef<HTMLVideoElement, WatchPlayerProps>((props, ref) => (
    <WatchPlayer {...props} videoRef={ref} />
  ))
);

ForwardRefPlayer.displayName = "ForwardRefPlayer";

const MIN_WIDTH = 400;
const MIN_HEIGHT = 225;

export const playerStateAtom = atom<PlayerProps>(null as PlayerProps);
export const playerPropsAtom = atom<WatchPlayerContextProps>(
  null as WatchPlayerContextProps
);
export const isBackgroundAtom = atom(false);
export const currentServerAtom = atom<AnimeServer>(null as AnimeServer);

const GlobalPlayerContextProvider: React.FC = ({ children }) => {
  const constraintsRef = useRef<HTMLDivElement>(null);

  const [playerState, setPlayerState] = useAtom(playerStateAtom);
  const playerProps = useAtomValue(playerPropsAtom);
  const setIsBackground = useSetAtom(isBackgroundAtom);
  const alertRef = useRef<Boolean>(false);
  const [currentServer, setCurrentServer] = useAtom(currentServerAtom);

  const { locale } = useRouter();
  const { back } = useHistory();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const router = useRouter();

  const shouldPlayInBackground = useMemo(() => {
    return !router?.pathname.includes("watch");
  }, [router?.pathname]);

  useEffect(() => {
    setIsBackground(shouldPlayInBackground);
  }, [shouldPlayInBackground, setIsBackground]);

  useEffect(() => {
    if (shouldPlayInBackground) {
      if (isMobile) {
        setPlayerState(null);
      }

      return;
    }

    // Set the player position just in case it is dragged
    x.set(0);
    y.set(0);
  }, [setPlayerState, shouldPlayInBackground, x, y]);

  const playerSize: MotionStyle = useMemo(() => {
    if (!shouldPlayInBackground) {
      return {
        width: "100%",
        height: "56.25vw",
        maxHeight: `calc(100vh - ${isMobileOnly ? "100" : "170"}px)`,
      };
    }

    if (typeof window === "undefined") {
      return {
        width: MIN_WIDTH,
        height: MIN_HEIGHT,
      };
    }

    const width = window.innerWidth * 0.3;
    const height = width * (9 / 16);

    return {
      width: MIN_WIDTH > width ? MIN_WIDTH : width,
      height: MIN_HEIGHT > height ? MIN_HEIGHT : height,
    };
  }, [shouldPlayInBackground]);

  const playerSource = useMemo(() => {
    return playerProps?.sources[0];
  }, [playerProps?.sources]);

  const isEmbed = useMemo(() => {
    return playerSource?.isEmbed;
  }, [playerSource?.isEmbed]);

  useEffect(() => {
    if (isEmbed && !alertRef.current) {
      toast.info("Embed videos might contain ads.");

      alertRef.current = true;
    }
  }, [isEmbed]);

  useEffect(() => {
    import("@/lib/x-frame-bypass");
  }, []);

  const playerSrc = useMemo(() => {
    return playerSource?.useProxy ||
      playerSource?.usePublicProxy ||
      playerSource?.useEdgeProxy
      ? createProxyUrl(
          playerSource?.file,
          playerSource?.proxy,
          playerSource?.usePublicProxy,
          playerSource?.useEdgeProxy,
          locale
        )
      : playerSource?.file;
  }, [
    playerSource?.file,
    playerSource?.proxy,
    playerSource?.useProxy,
    playerSource?.usePublicProxy,
    playerSource?.useEdgeProxy,
    locale,
  ]);

  return (
    <React.Fragment>
      <div className="fixed inset-0 pointer-events-none" ref={constraintsRef} />

      {!!playerState?.sources ? (
        <AnimatePresence initial={false}>
          <div
            className={classNames(
              "shadow-2xl",
              shouldPlayInBackground && "fixed bottom-4 right-4 z-[9999]"
            )}
          >
            <motion.div
              dragElastic={0}
              drag={shouldPlayInBackground}
              dragMomentum={false}
              dragConstraints={constraintsRef}
              style={{
                x,
                y,
                ...playerSize,
              }}
            >
              {!isEmbed ? (
                <ForwardRefPlayer {...playerState} />
              ) : (
                <div className="w-full h-full netplayer-container">
                  {!shouldPlayInBackground && (
                    <BsArrowLeft
                      className={classNames(
                        "transition-al absolute top-10 left-10 h-10 w-10 cursor-pointer duration-300 hover:text-gray-200"
                      )}
                      onClick={back}
                    />
                  )}

                  {!shouldPlayInBackground && playerProps?.anime?.id && (
                    <React.Fragment>
                      {/* I have no idea why Tailwind doesn't work, have to use inline styles instead. */}
                      <div
                        className="flex items-center gap-6 absolute"
                        style={{ top: "2.5rem", right: "2.5rem" }}
                      >
                        <div className="w-8 h-8">
                          {isMobileOnly ? (
                            <MobileServerSelector
                              activeServer={currentServer}
                              onServerChange={setCurrentServer}
                              servers={playerProps.servers}
                            />
                          ) : (
                            <DesktopServerSelector
                              activeServer={currentServer}
                              onServerChange={setCurrentServer}
                              servers={playerProps.servers}
                            />
                          )}
                        </div>
                      </div>
                    </React.Fragment>
                  )}

                  {shouldPlayInBackground && (
                    <div className="flex items-center gap-2 absolute top-4 left-4">
                      <div className="w-8 h-8">
                        <CircleButton
                          secondary
                          iconClassName="w-6 h-6"
                          className={"visible opacity-100"}
                          onClick={() =>
                            router.push(
                              `/anime/watch/${playerProps?.anime?.id}/${playerProps?.currentEpisode?.sourceId}/${playerProps?.currentEpisode?.sourceEpisodeId}`
                            )
                          }
                          LeftIcon={AiOutlineExpandAlt}
                        />
                      </div>
                      <div className="w-8 h-8">
                        <CircleButton
                          secondary
                          iconClassName="w-6 h-6"
                          className={"visible opacity-100"}
                          onClick={() => setPlayerState(null)}
                          LeftIcon={AiOutlineClose}
                        />
                      </div>
                    </div>
                  )}

                  <iframe
                    is="x-frame-bypass"
                    className="w-full h-full"
                    // @ts-ignore
                    // Custom attribute
                    target={playerSource?.file}
                    proxy={
                      playerSource.useProxy ||
                      playerSource.usePublicProxy ||
                      playerSource.useEdgeProxy
                    }
                    src={playerSrc}
                  />
                </div>
              )}
            </motion.div>
          </div>
        </AnimatePresence>
      ) : null}

      {children}
    </React.Fragment>
  );
};

export const useGlobalPlayer = (
  state: {
    playerState?: PlayerProps;
    playerProps?: WatchPlayerContextProps;
  } = {}
) => {
  const setPlayerState = useSetAtom(playerStateAtom);
  const setPlayerProps = useSetAtom(playerPropsAtom);

  useEffect(() => {
    if (state?.playerState) {
      setPlayerState(state.playerState);
    }

    if (state?.playerProps) {
      setPlayerProps(state.playerProps);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state?.playerState?.sources,
    state?.playerProps?.anime,
    state?.playerProps?.currentEpisode,
  ]);
};

export default GlobalPlayerContextProvider;
