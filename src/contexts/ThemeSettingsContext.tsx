import { atom, useAtom, useAtomValue } from "jotai";
import React, { useCallback, useEffect } from "react";

export const endModes = ["repeat", "refresh"] as const;

interface Settings {
  endMode: (typeof endModes)[number];
}

type Setter = <T extends keyof Settings>(
  setting: T,
  value: Settings[T]
) => void;

interface State extends Settings {
  setSetting: Setter;
}

const defaultSettings: Settings = {
  endMode: "repeat",
};

const themeSettingsAtom = atom<State>({
  ...defaultSettings,
  setSetting: () => {},
});

const LOCAL_STORAGE_KEY = "kaguya_theme_settings";

export const ThemeSettingsContextProvider: React.FC = () => {
  const [settings, setSettings] = useAtom(themeSettingsAtom);

  useEffect(() => {
    const settings =
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || defaultSettings;

    setSettings(settings);
  }, [setSettings]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  return null;
};

export const useThemeSettings = () => {
  const [settings, setSettings] = useAtom(themeSettingsAtom);

  const setSetting: Setter = useCallback(
    (key, value) => {
      setSettings({ ...settings, [key]: value });
    },
    [setSettings, settings]
  );

  return {
    ...settings,
    setSetting,
  };
};
