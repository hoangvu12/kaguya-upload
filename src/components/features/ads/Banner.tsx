import { useRouter } from "next/dist/client/router";
import React, { useEffect } from "react";
import { isMobileOnly } from "react-device-detect";

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
  size: ZoneSizeSelector;
}

const Banner: React.FC<BannerProps> = ({ size }) => {
  const [zone, setZone] = React.useState<Zone>(null);
  const { asPath } = useRouter();

  // const loadBanner = () => {
  //   (window.AdProvider = window.AdProvider || []).push({ serve: {} });
  // };

  useEffect(() => {
    setZone(
      zones.find(
        (zone) =>
          zone.size === (isMobileOnly ? size.mobile : size.desktop) &&
          zone.type === (isMobileOnly ? ScreenType.Mobile : ScreenType.Desktop)
      )
    );
  }, [size]);

  useEffect(() => {
    if (!zone) return;

    const script = document.createElement("script");
    const parentDiv = document.getElementById(zone.id);

    script.src = zone.url;
    script.async = true;
    // script.onload = loadBanner;

    parentDiv.appendChild(script);

    return () => {
      parentDiv.removeChild(script);
    };
  }, [asPath, zone]); // router prop or w/e

  return zone ? (
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
  ) : null;
};

export default Banner;
