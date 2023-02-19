import CircleButton from "@/components/shared/CircleButton";
import { useAds } from "@/contexts/AdsContext";
import classNames from "classnames";
import { useVideo } from "netplayer";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

const getShowChunks = (duration: number) => {
  if (!duration || duration <= 1) return [];

  const CHUNK_TIME = 300; // 5 minutes

  const chunks: Number[] = [];

  for (let i = 0; i < duration; i += CHUNK_TIME) {
    const startTime = i;
    const endTime = Math.min(i + CHUNK_TIME, duration);
    const centerTime = Math.floor((startTime + endTime) / 2);
    chunks.push(centerTime);
  }

  return chunks;
};

const SLOT_ID = "protag-fullwidth-ad-unit";

const PlayerBanner = () => {
  const { videoEl } = useVideo();
  const { isLoaded } = useAds();
  const [showBanner, setShowBanner] = useState(false);
  const hasDisplayedAdBefore = useRef(false);

  const shownChunks = useRef<Number[]>([]);

  const handleClose = () => {
    setShowBanner(false);
  };

  useEffect(() => {
    if (!isLoaded) return;

    let showChunks = getShowChunks(videoEl?.duration);

    const handleLoadedMetadata = () => {
      showChunks = getShowChunks(videoEl?.duration);
    };

    const handleTimeUpdate = () => {
      if (!showChunks?.length) {
        showChunks = getShowChunks(videoEl?.duration);
      }

      const currentTime = videoEl.currentTime;

      const showChunk = showChunks.find(
        (chunk) => chunk <= currentTime && !shownChunks.current.includes(chunk)
      );

      if (!showChunk) return;

      shownChunks.current.push(showChunk);

      console.log("show the goddamn banner");

      if (hasDisplayedAdBefore.current) {
        const slots = window.googletag?.pubads()?.getSlots() || [];

        const slot = slots.find((slot) => slot.getSlotElementId() === SLOT_ID);

        if (slot) {
          console.log("refreshed slot");

          window.googletag.pubads().refresh([slot]);
        } else {
          console.log("display slot inside refresh");

          window.protag.cmd.push(function () {
            window.protag.display("protag-fullwidth");
          });
        }
      } else {
        console.log("display slot");

        window.protag.cmd.push(function () {
          window.protag.display("protag-fullwidth");
        });

        hasDisplayedAdBefore.current = true;
      }
    };

    videoEl.addEventListener("loadedmetadata", handleLoadedMetadata);
    videoEl.addEventListener("timeupdate", handleTimeUpdate);

    const handleSlotRenderEnded = (
      event: googletag.events.SlotRenderEndedEvent
    ) => {
      if (event.slot.getSlotElementId() === SLOT_ID) {
        console.log(event.size);

        if (event.isEmpty) {
          console.log("is empty");

          setShowBanner(false);
        } else {
          console.log("got banner");

          setShowBanner(true);
        }
      }
    };

    window.googletag
      .pubads()
      .addEventListener("slotRenderEnded", handleSlotRenderEnded);

    return () => {
      videoEl.removeEventListener("loadedmetadata", handleLoadedMetadata);
      videoEl.removeEventListener("timeupdate", handleTimeUpdate);

      window.googletag
        .pubads()
        .removeEventListener("slotRenderEnded", handleSlotRenderEnded);
    };
  }, [isLoaded, videoEl]);

  return (
    <div
      className={classNames(
        "relative pointer-events-none",
        !showBanner && "hidden"
      )}
    >
      <div id="protag-fullwidth"></div>

      <CircleButton
        onClick={handleClose}
        className="!bg-background-600 absolute -top-5 -right-5 pointer-events-auto"
        secondary
        iconClassName="w-4 h-4"
        LeftIcon={AiOutlineClose}
        title="Close banner ad"
      />
    </div>
  );
};

export default PlayerBanner;
