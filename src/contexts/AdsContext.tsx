import { debounce } from "@/utils";
import Script from "next/script";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface AdsContextProps {
  isError: boolean;
  isLoaded: boolean;
}

const AdsContext = createContext<AdsContextProps>({} as AdsContextProps);

export const AdsProvider: React.FC = ({ children }) => {
  const [isError, setIsError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const registeredScripts = useRef<string[]>([]);
  const loadedScripts = useRef<string[]>([]);

  const handleScriptError = () => {
    setIsError(true);
  };

  const handleLoad = debounce(() => {
    if (registeredScripts.current.length === loadedScripts.current.length) {
      console.log("set is loaded");

      setIsLoaded(true);
    }
  }, 500);

  const handleScriptLoad = useCallback(
    (scriptId: string) => {
      if (!registeredScripts.current.includes(scriptId)) {
        registeredScripts.current.push(scriptId);
      }

      return () => {
        if (registeredScripts.current.includes(scriptId)) {
          loadedScripts.current.push(scriptId);
        }

        handleLoad();
      };
    },
    [handleLoad]
  );

  useEffect(() => {
    // @ts-ignore
    window.googletag = window.googletag || { cmd: [] };
    window.googletag.cmd.push(function () {
      window.googletag.pubads().enableSingleRequest();
      window.googletag.enableServices();

      handleScriptLoad("googletag-init")();
    });

    window.protag = window.protag || { cmd: [] };
    window.protag.config = {
      s: "kaguya.live",
      childADM: "22874911193",
      l: "Arf30PQf",
    };
    window.protag.cmd.push(function () {
      window.protag.pageInit();

      handleScriptLoad("protag-init")();
    });
  }, [handleScriptLoad]);

  return (
    <AdsContext.Provider value={{ isError, isLoaded }}>
      {/* <!--Google GPT/ADM code --> */}
      <Script
        type="text/javascript"
        async
        src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"
        onError={handleScriptError}
        onLoad={handleScriptLoad("googletag-script")}
      ></Script>

      {/* <!--Site config --> */}
      <Script
        type="text/javascript"
        async
        src="https://protagcdn.com/s/kaguya.live/site.js"
        onError={handleScriptError}
        onLoad={handleScriptLoad("protag-script")}
      ></Script>

      {process.env.NODE_ENV == "development" && (
        <Script
          id="dev-protag"
          dangerouslySetInnerHTML={{
            __html: `
                  window.googletag = window.googletag || { cmd: [] };
                  window.googletag.cmd.push(function () {
                      const slotIds = ['protag-before_content', 'protag-in_content', 'protag-after_content', 'protag-header', 'protag-sidebar', 'protag-mobile_leaderboard']
                      for (const slotId of slotIds) {
                      console.log('define: ' + slotId)
                        window.googletag
                          .defineSlot(
                            "/6355419/Travel/Europe/France/Paris",
                            [300, 250],
                            slotId
                          )
                          .addService(window.googletag.pubads())
                        // Enable the PubAdsService.
                      }
                      window.googletag.enableServices()
                  })
                `,
          }}
        />
      )}

      {children}
    </AdsContext.Provider>
  );
};

export function useAds(): AdsContextProps {
  const context = useContext(AdsContext);
  return context;
}
