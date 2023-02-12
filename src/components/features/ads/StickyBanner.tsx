/* eslint-disable @next/next/no-img-element */
import classNames from "classnames";
import Script from "next/script";
import React, { useEffect, useState } from "react";

const StickyBanner = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoaded = () => {
    console.log("script loaded");

    setIsLoaded(true);
  };

  // return (
  //   <div
  //     className={classNames(
  //       "z-[9000] flex flex-col md:flex-row items-center fixed bottom-4 w-full",
  //       isLoaded && "min-h-[100px]"
  //     )}
  //   >
  //     <div id="pf-63e46763ca8fd80027a851ae">
  //       <script
  //         async
  //         data-cfasync="false"
  //         src="https://platform.pubfuture.com/v1/unit/63e46763ca8fd80027a851ae.js?v=2"
  //         type="text/javascript"
  //         onLoad={handleLoaded}
  //       ></script>
  //     </div>

  //     <div className="grow" id="pf-63e46736a51c1e002988b2d5">
  //       <div className="bg-background-400 w-full h-full" />

  //       <script
  //         async
  //         data-cfasync="false"
  //         src="https://platform.pubfuture.com/v1/unit/63e46736a51c1e002988b2d5.js?v=2"
  //         type="text/javascript"
  //         onLoad={handleLoaded}
  //       ></script>
  //     </div>
  //   </div>
  // );

  useEffect(() => {
    setInterval(() => {
      const slots = window.googletag.pubads().getSlots();
      for (const slot of slots) {
        if (slot.getSlotElementId() == "protag-sticky-bottom-ad-unit") {
          window.googletag.cmd.push(() => {
            window.googletag.pubads().refresh([slot]);
          });
        }
      }
    }, 30000);
  }, []);

  return (
    <Script id="sticky" type="text/javascript">
      {`
        window.googletag = window.googletag || { cmd: [] };
        window.protag = window.protag || { cmd: [] };
        window.protag.cmd.push(function () {
            window.protag.display("protag-sticky-bottom");
        });
      `}
    </Script>
  );
};

export default React.memo(StickyBanner);
