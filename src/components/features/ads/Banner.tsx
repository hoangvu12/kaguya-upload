// import { useRouter } from "next/dist/client/router";
// import Script from "next/script";
// import React, { useEffect, useState } from "react";

// declare global {
//   // eslint-disable-next-line no-unused-vars
//   interface Window {
//     AdProvider: any;
//     googletag: Record<string, any>;
//     protag: Record<string, any>;
//   }
// }

// export enum ScreenType {
//   Desktop = "desktop",
//   Mobile = "mobile",
// }

// export const zones = [
//   {
//     type: "bfc",
//     id: "protag-before_content",
//     height: 250,
//   },
//   {
//     type: "afc",
//     id: "protag-after_content",
//     height: 250,
//   },
//   {
//     type: "isc",
//     id: "protag-in_content",
//     height: 250,
//   },
//   {
//     type: "header",
//     id: "protag-header",
//     height: 250,
//   },
// ] as const;

// // type MobileZoneSize = (typeof mobileZones)[number]["size"];
// // type DesktopZoneSize = (typeof desktopZones)[number]["size"];

// export type ZoneSize = (typeof zones)[number]["type"];
// export type Zone = (typeof zones)[number];

// // export type ZoneSizeSelector = {
// //   mobile: MobileZoneSize;
// //   desktop: DesktopZoneSize;
// // };

// export interface BannerProps {
//   size: ZoneSize;
// }

// const Banner: React.FC<BannerProps> = ({ size }) => {
//   const [zone, setZone] = React.useState<Zone>(
//     zones.find((zone) => zone.type === size)
//   );
//   const [isError, setIsError] = useState(false);
//   const { asPath } = useRouter();

//   useEffect(() => {
//     if (!zone) return;

//     window.googletag = window.googletag || { cmd: [] };
//     window.protag = window.protag || { cmd: [] };
//     window.protag.cmd.push(function () {
//       window.protag.display(zone.id);
//     });

//     // const script = document.createElement("script");

//     // setIsError(false);

//     // // script.src = zone.url;
//     // script.innerHTML = `
//     //   window.googletag = window.googletag || { cmd: [] };
//     //   window.protag = window.protag || { cmd: [] };
//     //   window.protag.cmd.push(function () {
//     //       window.protag.display('${zone.id}');
//     //   });
//     // `;
//     // script.async = true;
//     // script.onerror = () => {
//     //   setIsError(true);
//     // };
//     // // script.onload = loadBanner;

//     // document.body.appendChild(script);

//     // return () => {
//     //   document.body.removeChild(script);
//     // };
//   }, [asPath, zone]); // router prop or w/e

//   return zone ? (
//     isError ? (
//       <div
//         className="flex items-center justify-center gap-8 px-8 py-3 my-8 bg-primary-800 mx-auto w-[90vw] md:min-w-[24rem] md:w-[60vw]"
//         style={{
//           minHeight: zone.height,
//         }}
//       >
//         <p className="text-lg">
//           Help support Kaguya by disabling your ad-blocker. Ads on our site
//           allow us to continue providing high-quality content for you. Your
//           support is greatly appreciated.
//         </p>
//       </div>
//     ) : (
//       <div
//         className="flex items-center justify-center my-8"
//         style={{
//           minHeight: zone.height,
//         }}
//       >
//         <div id={zone.id}></div>

//         {/* <Script
//           key={zone.id}
//           id={`banner-${zone.id}`}
//           dangerouslySetInnerHTML={{
//             __html: `
//             window.googletag = window.googletag || { cmd: [] };
//             window.protag = window.protag || { cmd: [] };
//             window.protag.cmd.push(function () {
//                 window.protag.display('${zone.id}');
//             });
//           `,
//           }}
//         ></Script> */}

//         {/* <ins className="adsbyexoclick" data-zoneid={zone.id}></ins> */}
//       </div>
//     )
//   ) : null;
// };

// export default Banner;

import { useEffect, useMemo, useRef } from "react";
import { isMobileOnly } from "react-device-detect";

const ignoreAdUnitPath = ["interstitial", "sticky"];

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    AdProvider: any;
    googletag: Record<string, any>;
    protag: Record<string, any>;
  }
}

type BannerProps = {
  mobile: MobileBannerOption;
  desktop: DesktopBannerOption;
  type: "btf" | "atf" | "middle";
  refresh?: boolean;
};

const MobileBanner = [
  {
    size: "300x250",
    width: 320,
    height: 250,
  },
  {
    size: "320x100",
    width: 320,
    height: 100,
  },
  {
    size: "300x600",
    width: 300,
    height: 600,
  },
] as const;

const DesktopBanner = [
  {
    size: "970x250",
    width: 970,
    height: 250,
  },
  {
    size: "300x250",
    width: 300,
    height: 250,
  },
  {
    size: "300x600",
    width: 300,
    height: 600,
  },
] as const;

type MobileBannerOption = {
  size: (typeof MobileBanner)[number]["size"];
  setId?: string;
};

type DesktopBannerOption = {
  size: (typeof DesktopBanner)[number]["size"];
  setId?: string;
};

//https://support.google.com/admanager/answer/1100453?hl=en
const Banner: React.FC<BannerProps> = ({ desktop, mobile, type, refresh }) => {
  const slotRef = useRef(null);

  const divId = useRef(null);

  const { setId, size } = useMemo(
    () => (isMobileOnly ? mobile : desktop),
    [mobile, desktop]
  );

  if (!divId.current) {
    if (setId) {
      divId.current = setId;
    } else {
      if (isMobileOnly) {
        switch (size) {
          case "320x100":
            divId.current = "protag-header";
            break;
          case "300x250":
            if (type == "atf") {
              divId.current = "protag-before_content";
            } else if (type == "middle") {
              divId.current = "protag-in_content";
            } else if (type == "btf") {
              divId.current = "protag-after_content";
            }
            break;
          case "300x600":
            divId.current = "protag-sidebar";
            break;
        }
      } else if (!isMobileOnly) {
        switch (size) {
          case "300x600":
            divId.current = "protag-sidebar";
            break;
          case "300x250":
            if (type == "atf") {
              divId.current = "protag-before_content";
            } else if (type == "middle") {
              divId.current = "protag-in_content";
            } else if (type == "btf") {
              divId.current = "protag-after_content";
            }
            break;
          case "970x250":
            divId.current = "protag-header";
            break;
        }
      }
    }
  }

  useEffect(() => {
    if (!divId.current) return;

    window.googletag = window.googletag || { cmd: [] };

    window.googletag.cmd.push(() => {
      if (process.env.NODE_ENV === "development") {
        if (!slotRef.current) {
          window.googletag.cmd.push(() => {
            // Define an ad slot for div with id "banner-ad".
            window.googletag
              .defineSlot(
                "/6355419/Travel/Europe/France/Paris",
                [300, 250],
                divId.current
              )!
              .addService(window.googletag.pubads());

            // Enable the PubAdsService.
            window.googletag.enableServices();
            console.log("display divID " + divId.current);

            // Request and render an ad for the "banner-ad" slot.
            window.googletag.display(divId.current);
          });
        } else {
          window.googletag.cmd.push(() => {
            window.googletag.pubads().refresh([slotRef.current]);
          });
        }
      } else {
        if (!slotRef.current) {
          window.googletag = window.googletag || { cmd: [] };
          window.protag = window.protag || { cmd: [] };
          window.protag.cmd.push(function () {
            console.log("display divID " + divId.current);
            window.protag.display(divId.current);
          });
        } else {
          window.googletag.cmd.push(() => {
            window.googletag.pubads().refresh([slotRef.current]);
          });
        }
      }

      const setTagRefresh = () => {
        const slots = window.googletag.pubads().getSlots();

        if (slots.length == 0) {
          return;
        }

        if (!slotRef.current) {
          for (const slot of slots) {
            const adsId = slot.getSlotElementId();
            if (adsId.match(/interstitial/)) {
              continue;
            }
            const adElement = document.querySelector("#" + adsId);

            if (adElement) {
              const isParent = adElement.closest("#" + divId.current);
              if (isParent) {
                slotRef.current = slot;
                break;
              }
            }
          }
        }

        if (refresh && slotRef.current) {
          console.log(
            "set refresh attribute for ad: " +
              slotRef.current.getSlotElementId() +
              ":" +
              slotRef.current.getSlotId().getName()
          );
          slotRef.current.setTargeting("refresh", "true");
        }
      };

      if (process.env.NODE_ENV == "development") {
        setTagRefresh();
      } else {
        setTimeout(() => setTagRefresh(), 5000);
      }
    });

    return () => {
      window.googletag.cmd.push(() => {
        if (slotRef.current) {
          window.googletag.destroySlots([slotRef.current]);
          console.log("Destroy slots " + divId.current);
          slotRef.current = null;
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh, divId.current]);

  const bannerSize = useMemo(() => {
    if (isMobileOnly) {
      return MobileBanner.find((banner) => banner.size == size);
    } else {
      return DesktopBanner.find((banner) => banner.size == size);
    }
  }, [size]);

  return (
    <div
      className="flex items-center justify-center my-8"
      id={divId.current}
      style={{
        minWidth: bannerSize?.width,
        minHeight: bannerSize?.height,
      }}
    ></div>
  );
};

export default Banner;
