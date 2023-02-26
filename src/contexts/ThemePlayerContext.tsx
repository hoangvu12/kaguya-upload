import { AnimeTheme } from "@/types";
import { atom, useAtomValue } from "jotai";

interface State {
  theme: AnimeTheme;
  refresh: () => void;
  isLoading: boolean;
}

export const themePlayerStateAtom = atom<State>(null as State);

export const useThemePlayer = () => {
  return useAtomValue(themePlayerStateAtom);
};
