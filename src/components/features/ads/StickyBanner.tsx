import CircleButton from "@/components/shared/CircleButton";
import { useAds } from "@/contexts/AdsContext";
import React, { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

const StickyBanner = () => {
  const [isShow, setIsShow] = useState(true);
  const [isRendered, setIsRendered] = useState(false);
  const { isError, isLoaded } = useAds();

  const handleClose = () => {
    setIsShow(false);
  };

  useEffect(() => {
    if (!isLoaded || isError) return;

    if (typeof window?.googletag?.pubads !== "function") return;

    const handleSlotRenderEnded = (
      event: googletag.events.SlotRenderEndedEvent
    ) => {
      if (
        event.slot.getSlotElementId() === "protag-mobile_leaderboard-ad-unit"
      ) {
        if (event.isEmpty) {
          setIsRendered(false);
        } else {
          setIsRendered(true);
        }
      }
    };
    window.googletag
      .pubads()
      .addEventListener("slotRenderEnded", handleSlotRenderEnded);

    // @ts-ignore
    window.googletag = window.googletag || { cmd: [] };
    window.protag = window.protag || { cmd: [] };
    window.protag.cmd.push(function () {
      window.protag.display("protag-mobile_leaderboard");
    });

    return () => {
      window.googletag
        .pubads()
        .removeEventListener("slotRenderEnded", handleSlotRenderEnded);
    };
  }, [isError, isLoaded]);

  return (
    isShow &&
    !isError && (
      <div className="min-w-[320px] min-h-[50px] fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999]">
        <div className="w-full h-full" id="protag-mobile_leaderboard"></div>

        {isRendered && (
          <CircleButton
            onClick={handleClose}
            className="!bg-background-600 absolute -top-5 -right-5"
            secondary
            iconClassName="w-4 h-4"
            LeftIcon={AiOutlineClose}
            title="Close banner ad"
          />
        )}
      </div>
    )
  );
};

export default React.memo(StickyBanner);
