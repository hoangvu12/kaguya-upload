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
    id: 4909670,
    size: "300x250",
    type: ScreenType.Mobile,
    width: 300,
    height: 250,
  },
  {
    id: 4909700,
    size: "300x100",
    type: ScreenType.Mobile,
    width: 300,
    height: 100,
  },
] as const;

export const desktopZones = [
  {
    id: 4909666,
    size: "900x250",
    type: ScreenType.Desktop,
    width: 900,
    height: 250,
  },
  {
    id: 4909696,
    size: "728x90",
    type: ScreenType.Desktop,
    width: 728,
    height: 90,
  },
  {
    id: 4909698,
    size: "160x600",
    type: ScreenType.Desktop,
    width: 160,
    height: 600,
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

  const loadBanner = () => {
    (window.AdProvider = window.AdProvider || []).push({ serve: {} });
  };

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
    const script = document.createElement("script");

    script.src = "https://a.exdynsrv.com/ad-provider.js";
    script.async = true;
    script.onload = loadBanner;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [asPath]); // router prop or w/e

  return zone ? (
    <div
      className="flex items-center justify-center my-8"
      style={{
        minWidth: zone.width,
        minHeight: zone.height,
      }}
    >
      <ins className="adsbyexoclick" data-zoneid={zone.id}></ins>
    </div>
  ) : null;
};

export default Banner;
