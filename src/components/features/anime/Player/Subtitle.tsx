import { isBackgroundAtom } from "@/contexts/GlobalPlayerContext";
import { isValidUrl } from "@/utils";
import { parse } from "@plussub/srt-vtt-parser";
import classNames from "classnames";
import { useAtomValue } from "jotai";
import SubtitlesOctopus from "libass-wasm";
import {
  useInteract,
  useSubtitleSettings,
  useTextScaling,
  useVideo,
  useVideoProps,
  useVideoState,
} from "netplayer";
import { useEffect, useMemo, useRef, useState } from "react";
import { isDesktop } from "react-device-detect";
import { toast } from "react-toastify";
import { buildAbsoluteURL } from "url-toolkit";
import { PlayerProps } from ".";

const textStyles = {
  none: "",
  outline: `black 0px 0px 3px, black 0px 0px 3px, black 0px 0px 3px, black 0px 0px 3px, black 0px 0px 3px`,
};

const BASE_FONT_SIZE = 16;
const LINE_HEIHT_RATIO = 1.333;
const PADDING_X_RATIO = 0.5;
const PADDING_Y_RATIO = 0.25;

const M3U8_SUBTITLE_REGEX = /.*\.(vtt|srt)/g;

const requestSubtitle = async (url: string): Promise<string | null> => {
  if (url.includes("vtt") || url.includes("srt")) {
    const response = await fetch(url);
    const text = await response.text();

    return text;
  }

  if (url.includes("m3u8")) {
    const response = await fetch(url);
    const text = await response.text();

    const matches = text.match(M3U8_SUBTITLE_REGEX);

    if (!matches?.length) return null;

    const nextUrl = isValidUrl(matches[0])
      ? matches[0]
      : buildAbsoluteURL(url, matches[0]);

    return requestSubtitle(nextUrl);
  }

  return null;
};

const Subtitle = () => {
  const { state } = useVideoState();
  const { state: subtitleSettings } = useSubtitleSettings();
  const { moderateScale, update } = useTextScaling();
  const isBackground = useAtomValue(isBackgroundAtom);
  const { videoEl } = useVideo();
  const { isInteracting } = useInteract();
  const [currentText, setCurrentText] = useState<string>("");
  const [subtitleText, setSubtitleText] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const subtitlesOctopusRef = useRef(null);

  const subtitle = useMemo(
    () => state.subtitles?.find((sub) => sub.lang === state.currentSubtitle),
    [state.subtitles, state.currentSubtitle]
  );

  useEffect(() => {
    if (!subtitle?.file) return;

    if (subtitlesOctopusRef.current) {
      subtitlesOctopusRef.current.dispose();

      subtitlesOctopusRef.current = null;
    }

    if (subtitle.file.includes(".ass")) {
      const options = {
        video: videoEl,
        subUrl: subtitle.file,
        // fonts: fonts?.map((font) => font?.file),
        workerUrl: "/subtitles-octopus-worker.js",
        legacyWorkerUrl: "/subtitles-octopus-worker-legacy.js",
      };

      const instance = new SubtitlesOctopus(options);

      subtitlesOctopusRef.current = instance;

      setCurrentText(null);
      setSubtitleText(null);

      return;
    }

    const getSubtitle = async () => {
      setIsLoading(true);

      const text = await requestSubtitle(subtitle.file);

      setIsLoading(false);

      if (!text) return;

      setSubtitleText(text);
    };

    getSubtitle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtitle, videoEl]);

  useEffect(() => {
    // Video animation takes 300 milliseconds to complete
    setTimeout(() => {
      update();
    }, 500);
  }, [isBackground, update]);

  useEffect(() => {
    if (!subtitleText) return;
    if (!videoEl) return;

    try {
      const { entries = [] } = parse(subtitleText);

      const handleSubtitle = () => {
        const currentTime = videoEl.currentTime * 1000;
        const currentEntry = entries.find(
          (entry) => entry.from <= currentTime && entry.to >= currentTime
        );

        setCurrentText(currentEntry?.text || "");
      };

      if (subtitle.file.includes(".ass")) {
        videoEl.removeEventListener("timeupdate", handleSubtitle);

        return;
      }

      videoEl.addEventListener("timeupdate", handleSubtitle);

      return () => {
        videoEl.removeEventListener("timeupdate", handleSubtitle);
      };
    } catch (err) {
      toast.error(
        `Failed to parse subtitle [${subtitle.lang} - ${subtitle.language}]`
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtitleText]);

  const fontSize = useMemo(() => {
    return moderateScale(subtitleSettings.fontSize * BASE_FONT_SIZE);
  }, [moderateScale, subtitleSettings.fontSize]);

  const lineHeight = useMemo(() => {
    return fontSize * LINE_HEIHT_RATIO;
  }, [fontSize]);

  const padding = useMemo(() => {
    return {
      horizontal: fontSize * PADDING_X_RATIO,
      vertical: fontSize * PADDING_Y_RATIO,
    };
  }, [fontSize]);

  if (isLoading || !subtitle?.file || !currentText || state.isSubtitleDisabled)
    return null;

  return (
    <div
      className={classNames(
        "netplayer-subtitle absolute left-1/2 -translate-x-1/2 w-[80%] flex items-center justify-evenly transition-all duration-300",
        isInteracting && isDesktop && !isBackground ? "bottom-24" : "bottom-4"
      )}
    >
      <p
        className="w-fit text-white bg-black/80 rounded-sm leading-7 text-center whitespace-pre-wrap"
        style={{
          paddingLeft: padding.horizontal + "px",
          paddingRight: padding.horizontal + "px",
          paddingTop: padding.vertical + "px",
          paddingBottom: padding.vertical + "px",
          fontSize: fontSize + "px",
          lineHeight: lineHeight + "px",
          backgroundColor: `rgba(0, 0, 0, ${subtitleSettings.backgroundOpacity})`,
          color: `rgba(255, 255, 255, ${subtitleSettings.fontOpacity})`,
          textShadow: textStyles[subtitleSettings.textStyle],
        }}
        dangerouslySetInnerHTML={{ __html: currentText }}
      ></p>
    </div>
  );
};

export default Subtitle;
