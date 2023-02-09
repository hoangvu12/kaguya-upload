import { useRouter } from "next/dist/client/router";
import React, { useEffect, useState } from "react";
import { isMobileOnly } from "react-device-detect";
import { FiAlertTriangle } from "react-icons/fi";

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    AdProvider: any;
  }
}

export enum ScreenType {
  Desktop = "desktop",
  Mobile = "mobile",
}

export const mobileZones = [
  {
    id: "pf-63e4671aca8fd80027a8519a",
    size: "300x250",
    type: ScreenType.Mobile,
    width: 300,
    height: 250,
    url: "https://platform.pubfuture.com/v1/unit/63e4671aca8fd80027a8519a.js?v=2",
  },
] as const;

export const desktopZones = [
  {
    id: "pf-63e468d6f41bf4002779ba8d",
    size: "970x250",
    type: ScreenType.Desktop,
    width: 970,
    height: 250,
    url: "https://platform.pubfuture.com/v1/unit/63e468d6f41bf4002779ba8d.js?v=2",
  },
] as const;

export const zones = [...mobileZones, ...desktopZones] as const;

type MobileZoneSize = (typeof mobileZones)[number]["size"];
type DesktopZoneSize = (typeof desktopZones)[number]["size"];

export type ZoneSize = (typeof zones)[number]["size"];
export type Zone = (typeof zones)[number];

export type ZoneSizeSelector = {
  mobile: MobileZoneSize;
  desktop: DesktopZoneSize;
};

export interface BannerProps {
  size: ZoneSizeSelector | ZoneSize;
}

const Banner: React.FC<BannerProps> = ({ size }) => {
  const [zone, setZone] = React.useState<Zone>(null);
  const [isError, setIsError] = useState(false);
  const { asPath } = useRouter();

  // const loadBanner = () => {
  //   (window.AdProvider = window.AdProvider || []).push({ serve: {} });
  // };

  useEffect(() => {
    let zone = null;

    if (typeof size === "string") {
      zone = zones.find((zone) => zone.size === size);
    } else if (typeof size === "object") {
      zone = zones.find(
        (zone) =>
          zone.size === (isMobileOnly ? size.mobile : size.desktop) &&
          zone.type === (isMobileOnly ? ScreenType.Mobile : ScreenType.Desktop)
      );
    }

    setZone(zone);
  }, [size]);

  useEffect(() => {
    if (!zone) return;

    const script = document.createElement("script");
    const parentDiv = document.getElementById(zone.id);

    script.src = zone.url;
    script.async = true;
    script.onerror = () => {
      setIsError(true);
    };
    // script.onload = loadBanner;

    parentDiv.appendChild(script);

    return () => {
      parentDiv.removeChild(script);
    };
  }, [asPath, zone]); // router prop or w/e

  return zone ? (
    isError ? (
      <div
        className="flex items-center justify-center gap-8 px-8 py-3 my-8 bg-primary-800 mx-auto w-[90vw] md:min-w-[24rem] md:w-[60vw]"
        style={{
          minHeight: zone.height,
        }}
      >
        <p className="text-lg">
          Help support Kaguya by disabling your ad-blocker. Ads on our site
          allow us to continue providing high-quality content for you. Your
          support is greatly appreciated.
        </p>
      </div>
    ) : (
      <div
        className="flex items-center justify-center my-8"
        style={{
          minWidth: zone.width,
          minHeight: zone.height,
        }}
      >
        <div id={zone.id}></div>

        {/* <ins className="adsbyexoclick" data-zoneid={zone.id}></ins> */}
      </div>
    )
  ) : null;
};

export default Banner;
