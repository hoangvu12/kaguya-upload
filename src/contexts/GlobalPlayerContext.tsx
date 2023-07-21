import { WatchPlayerProps } from "@/components/features/anime/WatchPlayer";
import { Media } from "@/types/anilist";
import { Episode, Video, VideoServer } from "@/types/core";
import classNames from "classnames";
import {
  AnimatePresence,
  MotionStyle,
  motion,
  useMotionValue,
} from "framer-motion";
import { atom, useAtom, useSetAtom } from "jotai";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useRef } from "react";
import { isMobile, isMobileOnly } from "react-device-detect";

export interface WatchPlayerContextProps {
  anime: Media;
  episodes: Episode[];
  currentEpisode: Episode;
  currentEpisodeIndex: number;
  setEpisode: (episode: Episode) => void;
  sourceId: string;
  sources: Video[];
  servers: VideoServer[];
}

const WatchPlayer = dynamic(
  () => import("@/components/features/anime/WatchPlayer"),
  {
    ssr: false,
  }
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
export const currentServerAtom = atom<VideoServer>(null as VideoServer);

const GlobalPlayerContextProvider: React.FC = ({ children }) => {
  const constraintsRef = useRef<HTMLDivElement>(null);

  const [playerState, setPlayerState] = useAtom(playerStateAtom);
  const setIsBackground = useSetAtom(isBackgroundAtom);

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
              <ForwardRefPlayer {...playerState} />
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
