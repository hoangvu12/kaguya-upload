import { useTranslation } from "next-i18next";
import React, { useEffect, useMemo, useState } from "react";
import { isMobileOnly } from "react-device-detect";

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    AdProvider: any;
    protag: Record<string, any>;
  }
}

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

type BannerProps = {
  mobile?: (typeof mobileBanners)[number]["size"];
  desktop?: (typeof desktopBanners)[number]["size"];
  type: "btf" | "atf" | "middle";
  refresh?: boolean;
  width?: number | string;
  height?: number | string;
};

const defaultAdBlockerMessage =
  "Help support Kaguya by disabling your ad-blocker. Ads on our site allow us to continue providing high-quality content for you. Your support is greatly appreciated.";

//https://support.google.com/admanager/answer/1100453?hl=en
const Banner: React.FC<BannerProps> = ({
  desktop,
  mobile,
  type,
  refresh,
  width,
  height,
}) => {
  const [isError, setIsError] = useState(false);
  const { t } = useTranslation("common");

  const size = useMemo(
    () => (isMobileOnly ? mobile : desktop),
    [mobile, desktop]
  );

  const divId = useMemo(() => {
    switch (size) {
      case "320x100":
      case "970x250":
        return "protag-header";
      case "300x600":
        return "protag-sidebar";
      case "300x250":
        if (type == "atf") {
          return "protag-before_content";
        }
        if (type == "middle") {
          return "protag-in_content";
        }
        if (type == "btf") {
          return "protag-after_content";
        }
      default:
        "";
    }
  }, [size, type]);

  useEffect(() => {
    if (!divId) return;

    if (!("display" in window.protag)) {
      setIsError(true);

      return;
    }

    const script = document.createElement("script");
    script.innerHTML = `
      window.googletag = window.googletag || { cmd: [] };
      window.protag = window.protag || { cmd: [] };
      window.protag.cmd.push(function () {
          window.protag.display('${divId}')
      });
    `;

    document.body.appendChild(script);

    let interval: NodeJS.Timer = null;

    if (refresh) {
      interval = setInterval(() => {
        const slots = window.googletag.pubads().getSlots();

        for (const slot of slots) {
          const adsId = slot.getSlotElementId();

          const ignoreAds = ["sticky", "interstitial"];

          if (!adsId) return;

          if (ignoreAds.some((id) => adsId.includes(id))) {
            continue;
          }

          const adElement = document.querySelector("#" + adsId);

          if (adElement) {
            const isParent = adElement.closest("#" + divId);
            if (isParent) {
              window.googletag.cmd.push(() => {
                window.googletag.pubads().refresh([slot]);
              });

              break;
            }
          }
        }
      }, 120000);
    }

    return () => {
      document.body.removeChild(script);

      if (interval) {
        clearInterval(interval);
      }
    };
  }, [divId, refresh]);

  const bannerSize = useMemo(() => {
    if (isMobileOnly) {
      return mobileBanners.find((banner) => banner.size == size);
    } else {
      return desktopBanners.find((banner) => banner.size == size);
    }
  }, [size]);

  return isError ? (
    <div
      style={{
        ...(height ? { height: height } : { minHeight: bannerSize?.height }),
      }}
      className="flex items-center justify-center gap-8 px-8 py-3 my-8 bg-primary-800 mx-auto w-full max-w-[90vw] md:max-w-[60vw]"
    >
      <p className="text-lg">
        {t("adblock_message", { defaultValue: defaultAdBlockerMessage })}
      </p>
    </div>
  ) : divId ? (
    <div
      className="flex items-center justify-center my-4 md:my-8"
      id={divId}
      style={{
        ...(width ? { width: width } : { minWidth: bannerSize?.width }),
        ...(height ? { height: height } : { minHeight: bannerSize?.height }),
      }}
    />
  ) : null;
};

export default Banner;
