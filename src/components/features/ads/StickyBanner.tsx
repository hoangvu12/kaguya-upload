import CircleButton from "@/components/shared/CircleButton";
import Script from "next/script";
import React, { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

const StickyBanner = () => {
  const [isShow, setIsShow] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      const slots = window.googletag.pubads().getSlots();

      for (const slot of slots) {
        if (slot.getSlotElementId() == "protag-mobile_leaderboard-ad-unit") {
          window.googletag.cmd.push(() => {
            window.googletag.pubads().refresh([slot]);
          });
        }
      }
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleClose = () => {
    setIsShow(false);
  };

  return (
    <div className="min-w-[320px] min-h-[50px] fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999]">
      {isShow && (
        <div className="w-full h-full" id="protag-mobile_leaderboard"></div>
      )}

      <CircleButton
        onClick={handleClose}
        className="!bg-background-600 absolute -top-5 -right-5"
        secondary
        iconClassName="w-4 h-4"
        LeftIcon={AiOutlineClose}
        title="Close banner ad"
      />

      <Script id="sticky" type="text/javascript">
        {`
        window.googletag = window.googletag || { cmd: [] };
        window.protag = window.protag || { cmd: [] };
        window.protag.cmd.push(function () {
            window.protag.display("protag-mobile_leaderboard");
        });
      `}
      </Script>
    </div>
  );

  return null;
};

export default React.memo(StickyBanner);
