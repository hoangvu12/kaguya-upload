import { atom, useAtom } from "jotai";
import { selectAtom } from "jotai/utils";

interface State {
  isSidebarOpen: boolean;
  activeImageIndex: number;
}

const defaultState: State = {
  isSidebarOpen: true,
  activeImageIndex: 0,
};

export const readPanelStateAtom = atom(defaultState);

export const isSidebarOpenAtom = selectAtom(
  readPanelStateAtom,
  (data) => data.isSidebarOpen
);
export const activeImageIndexAtom = selectAtom(
  readPanelStateAtom,
  (data) => data.activeImageIndex
);

export const useReadPanel = () => {
  const [state, setState] = useAtom(readPanelStateAtom);

  return {
    state,
    setState,
  };
};
