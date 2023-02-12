import Script from "next/script";
import React, { useEffect, useMemo, useRef } from "react";
import { isMobileOnly } from "react-device-detect";

const ignoreAdUnitPath = ["interstitial", "sticky"];

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    AdProvider: any;
    protag: Record<string, any>;
  }
}

type BannerProps = {
  mobile: MobileBannerOption;
  desktop: DesktopBannerOption;
  type: "btf" | "atf" | "middle";
  refresh?: boolean;
};

const mobileBanners = [
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

const desktopBanners = [
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
  size: (typeof mobileBanners)[number]["size"];
  setId?: string;
};

type DesktopBannerOption = {
  size: (typeof desktopBanners)[number]["size"];
  setId?: string;
};

//https://support.google.com/admanager/answer/1100453?hl=en
const Banner: React.FC<BannerProps> = ({ desktop, mobile, type }) => {
  const { setId, size } = useMemo(
    () => (isMobileOnly ? mobile : desktop),
    [mobile, desktop]
  );
  const slotRef = useRef<googletag.Slot>(null);

  const divId = useRef(null);
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
      } else {
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

  // useEffect(() => {
  //   if (!divId.current) {
  //     console.log("no divId found");

  //     return;
  //   }

  //   if (!("googletag" in window)) return;

  //   const slots = window.googletag.pubads().getSlots();

  //   for (const slot of slots) {
  //     const adsId = slot.getSlotElementId();

  //     if (ignoreAdUnitPath.some((path) => adsId.includes(path))) {
  //       continue;
  //     }

  //     if (adsId.includes(divId.current)) {
  //       slotRef.current = slot;

  //       break;
  //     }
  //   }

  //   if (!slotRef.current) {
  //     window.googletag = window.googletag;
  //     window.protag = window.protag;

  //     window.protag.cmd.push(function () {
  //       console.log("display divID " + divId.current);
  //       window.protag.display(divId.current);
  //     });
  //   } else {
  //     window.googletag.pubads().refresh([slotRef.current]);
  //   }
  // }, []);

  useEffect(() => {
    // @ts-ignore
    window.googletag = window.googletag || { cmd: [] };
    window.googletag.cmd.push(() => {
      if (!slotRef.current) {
        // Request and render an ad for the "banner-ad" slot.
        console.log("display divID " + divId.current);
        if (process.env.NODE_ENV === "development") {
          window.googletag.display(divId.current);
        } else {
          window.protag.display(divId.current);
        }
      } else {
        console.log("refresh " + divId.current);
        window.googletag.pubads().refresh([slotRef.current]);
      }

      function setTagRefresh() {
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
      }

      if (process.env.NODE_ENV === "development") {
        setTagRefresh();
      } else {
        setTimeout(setTagRefresh, 5000);
      }
    });
  }, []);

  const bannerSize = useMemo(() => {
    if (isMobileOnly) {
      return mobileBanners.find((banner) => banner.size == size);
    } else {
      return desktopBanners.find((banner) => banner.size == size);
    }
  }, [size]);

  return (
    <React.Fragment>
      <div
        className="flex items-center justify-center my-8"
        id={divId.current}
        style={{
          minWidth: bannerSize?.width,
          minHeight: bannerSize?.height,
        }}
      />

      {process.env.NODE_ENV === "development" && (
        <Script
          id={"define-ad-slot-development"}
          dangerouslySetInnerHTML={{
            __html: `
              window.googletag = window.googletag || { cmd: [] };
              window.googletag.cmd.push(function () {
                  const slotIds = ['protag-before_content', 'protag-in_content', 'protag-after_content', 'protag-header', 'protag-sidebar']
                  for (const slotId of slotIds) {
                  console.log('define: ' + slotId)
                    window.googletag
                      .defineSlot(
                        "/6355419/Travel/Europe/France/Paris",
                        [300, 250],
                        slotId
                      )
                      .addService(window.googletag.pubads())
                    // Enable the PubAdsService.
                  }
                  window.googletag.enableServices()
              })
            `,
          }}
        />
      )}
    </React.Fragment>
  );
};

export default Banner;
