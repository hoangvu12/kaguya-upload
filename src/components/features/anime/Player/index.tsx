import { SKIP_TIME } from "@/constants";
import useConstantTranslation from "@/hooks/useConstantTranslation";
import { Subtitle as SubtitleType, Video } from "@/types/core";
import NetPlayer, { NetPlayerProps } from "netplayer";
import React, { useMemo } from "react";
import Subtitle from "./Subtitle";

const skipOPEDHotkey = () => ({
  fn: (videoEl: HTMLVideoElement) => {
    videoEl.currentTime = videoEl.currentTime + SKIP_TIME;
  },
  hotKey: "shift+right",
  name: "skip-op/ed",
});

export interface PlayerProps
  extends Omit<NetPlayerProps, "sources" | "subtitles"> {
  sources: Video[];
  subtitles: SubtitleType[];
}

const Player = React.forwardRef<HTMLVideoElement, PlayerProps>(
  (
    { hotkeys = [], components = [], subtitles = [], sources, ...props },
    ref
  ) => {
    const { PLAYER_TRANSLATIONS } = useConstantTranslation();

    const playerComponents = useMemo(
      () => ({ ...components, Subtitle }),
      [components]
    );

    const playerHotkeys = useMemo(
      () => [skipOPEDHotkey(), ...hotkeys],
      [hotkeys]
    );

    const composedSubtitles = useMemo(
      () =>
        subtitles.map((sub) => ({
          file: sub.file.url,
          lang: sub.language,
          language: sub.language,
          format: sub.format,
        })),
      [subtitles]
    );

    const composedSources = useMemo(
      () =>
        sources.map((source) => ({
          file: source.file.url,
          label: source.quality,
          type: source.format,
        })),
      [sources]
    );

    return (
      <NetPlayer
        ref={ref}
        i18n={PLAYER_TRANSLATIONS}
        hotkeys={playerHotkeys}
        components={playerComponents}
        subtitles={composedSubtitles}
        sources={composedSources}
        preferQuality={(qualities) => {
          const priority = ["1080p", "720p", "480p", "360p", "240p"];

          return findHighestPriorityString(qualities, priority) || qualities[0];
        }}
        // @ts-ignore
        crossOrigin={null}
        disableVolumeSlider
        hlsVersion="1.3.5"
        {...props}
      >
        {props.children}
      </NetPlayer>
    );
  }
);

Player.displayName = "Player";

export default Player;

function findHighestPriorityString(strings: string[], priorityList: string[]) {
  const priorityMap = new Map<string, number>();

  // Create a map of each string's priority
  for (let i = 0; i < priorityList.length; i++) {
    priorityMap.set(priorityList[i], i);
  }

  let highestPriorityString: string = "";
  let highestPriority = Infinity;

  // Iterate over the strings and update the highest priority string
  for (let i = 0; i < strings.length; i++) {
    const string = strings[i];
    const priority = priorityMap.get(string);

    if (priority !== undefined && priority < highestPriority) {
      highestPriorityString = string;
      highestPriority = priority;
    }
  }

  return highestPriorityString;
}
