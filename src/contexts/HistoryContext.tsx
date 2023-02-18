// https://stackoverflow.com/questions/55565631/how-to-get-previous-url-in-next-js

import { useRouter } from "next/router";
import React, { createContext, useContext, useCallback } from "react";

interface HValidation {
  back(): void;
}

const HistoryContext = createContext<HValidation>({} as HValidation);
export const HistoryProvider: React.FC = ({ children }) => {
  const router = useRouter();

  const back = useCallback(() => {
    if (typeof window !== "undefined" && +window?.history?.state?.idx > 0) {
      router.back();

      return;
    }

    router.push("/");
  }, [router]);

  return (
    <HistoryContext.Provider
      value={{
        back,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

export function useHistory(): HValidation {
  const context = useContext(HistoryContext);
  return context;
}
