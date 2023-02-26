import { atom, useAtom } from "jotai";
import React, { useEffect } from "react";

export const fitModes = ["width", "height", "auto"] as const;
export const directions = ["vertical", "ltr", "rtl"] as const;

interface Settings {
  fitMode: (typeof fitModes)[number];
  zoom: number;
  direction: (typeof directions)[number];
}

type Setter = <T extends keyof Settings>(
  setting: T,
  value: Settings[T]
) => void;

const defaultSettings: Settings = {
  fitMode: "auto",
  zoom: 1,
  direction: "vertical",
};

const readSettingsAtom = atom({ ...defaultSettings, setSetting: () => {} });

export const ReadSettingsContextProvider: React.FC = () => {
  const [settings, setSettings] = useAtom(readSettingsAtom);

  useEffect(() => {
    const settings =
      JSON.parse(localStorage.getItem("settings")) || defaultSettings;

    setSettings(settings);
  }, [setSettings]);

  useEffect(() => {
    localStorage.setItem("settings", JSON.stringify(settings));
  }, [settings]);

  return null;
};

export const useReadSettings = () => {
  const [settings, setSettings] = useAtom(readSettingsAtom);

  const setSetting: Setter = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  return {
    ...settings,
    setSetting,
  };
};
