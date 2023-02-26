import { atom, useAtom } from "jotai";

export interface Timestamp {
  startTime: number;
  endTime: number;
  title: string;
}

interface State {
  timestamps: Timestamp[];
}

const defaultState: State = {
  timestamps: [],
};

const videoStateAtom = atom<State>(defaultState);

export const useCustomVideoState = () => {
  const [state, setState] = useAtom(videoStateAtom);

  return {
    state,
    setState,
  };
};
