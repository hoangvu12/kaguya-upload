import { BaseButtonProps } from "@/components/shared/BaseButton";
import Button from "@/components/shared/Button";
import Portal from "@/components/shared/Portal";
import { useCustomVideoState } from "@/contexts/CustomVideoStateContext";
import { SkipTimeStamp, SkipType } from "@/types";
import axios from "axios";
import classNames from "classnames";
import { useInteract, useVideo } from "netplayer";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { isMobileOnly } from "react-device-detect";
import { useQuery } from "react-query";

interface TimestampSkipButtonProps extends BaseButtonProps {
  episode: number;
  malId: number;
}

const getTimestamps = async (
  episode: number,
  malId: number,
  episodeLength: number
): Promise<SkipTimeStamp[]> => {
  const { data } = await axios.get<any>(
    `https://api.aniskip.com/v2/skip-times/${malId}/${episode}`,
    {
      params: {
        types: ["ed", "mixed-ed", "mixed-op", "op", "recap"],
        episodeLength,
      },
      validateStatus: (status) => status === 200 || status === 404,
    }
  );

  return data?.results || ([] as SkipTimeStamp[]);
};

const getTypeName = (skipType: SkipType) => {
  if (skipType === "op") {
    return "Opening";
  }

  if (skipType === "ed") {
    return "Ending";
  }

  if (skipType === "mixed-ed") {
    return "Mixed ED";
  }

  if (skipType === "mixed-op") {
    return "Mixed OP";
  }

  if (skipType === "recap") {
    return "Recap";
  }
};

const TimestampSkipButton: React.FC<TimestampSkipButtonProps> = ({
  episode,
  malId,
  className,
  ...props
}) => {
  const { videoEl } = useVideo();
  const { setState } = useCustomVideoState();
  const { isInteracting } = useInteract();
  const { data: timestamps, isLoading: timestampLoading } = useQuery<
    SkipTimeStamp[]
  >(
    `timestamps-${episode}-${malId}`,
    () => {
      if (isNaN(videoEl?.duration) || videoEl?.duration < 1) return;

      return getTimestamps(episode, malId, videoEl?.duration);
    },
    { enabled: !isNaN(videoEl?.duration) && videoEl?.duration > 1 }
  );
  const [timestamp, setTimeStamp] = useState<SkipTimeStamp>(null);

  useEffect(() => {
    if (!timestamps?.length) {
      setState((prev) => ({
        ...prev,
        timestamps: [],
      }));

      return;
    }

    const composedTimestamps = timestamps.map((ts) => ({
      startTime: ts.interval.startTime,
      endTime: ts.interval.endTime,
      title: getTypeName(ts.skipType),
    }));

    setState((prev) => ({
      ...prev,
      timestamps: composedTimestamps,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timestamps]);

  useEffect(() => {
    if (!timestamps?.length) {
      setTimeStamp(null);

      return;
    }

    if (!videoEl) return;

    const handleProgress = () => {
      const currentTime = videoEl?.currentTime;

      const timestamp = timestamps?.find(
        (ts) =>
          ts.interval.startTime <= currentTime &&
          ts.interval.endTime >= currentTime
      );

      setTimeStamp(timestamp);
    };

    videoEl.addEventListener("timeupdate", handleProgress);

    return () => {
      videoEl.removeEventListener("timeupdate", handleProgress);
    };
  }, [episode, malId, timestamps, videoEl]);

  const timeStampName = useMemo(
    () => (timestamp?.skipType ? getTypeName(timestamp.skipType) : null),
    [timestamp?.skipType]
  );

  const handleClick = useCallback(
    (
      e:
        | React.MouseEvent<HTMLButtonElement, MouseEvent>
        | React.TouchEvent<HTMLButtonElement>
    ) => {
      e.stopPropagation();

      if (!timestamp) return;

      const { endTime } = timestamp.interval;

      videoEl.currentTime = endTime;
    },
    [timestamp, videoEl]
  );

  const handleTouch = useCallback(
    (e: React.TouchEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (!timestamp) return;

      const { endTime } = timestamp.interval;
      videoEl.currentTime = endTime;
    },
    [timestamp, videoEl]
  );

  const timestampSkipButtonClassName = useMemo(() => {
    if (isMobileOnly) {
      if (!isInteracting) {
        return "bottom-16 visible opacity-100";
      }

      return "bottom-16 invisible opacity-0";
    }

    if (isInteracting) {
      return "bottom-24";
    }

    return "bottom-16";
  }, [isInteracting]);

  return (
    <Portal retryInterval={1000} selector=".netplayer-container">
      {timestamp && !timestampLoading ? (
        <Button
          className={classNames(
            "z-[99999] absolute right-4 transition-all duration-300 font-semibold tracking-wider uppercase text-white/90 hover:text-white border border-solid border-white/80 hover:border-white bg-zinc-800/80 hover:bg-zinc-800/60",
            timestampSkipButtonClassName,
            className
          )}
          onMouseDown={handleClick}
          onTouchStart={handleTouch}
          {...props}
        >
          Skip {timeStampName}
        </Button>
      ) : null}
    </Portal>
  );
};

export default React.memo(TimestampSkipButton);
