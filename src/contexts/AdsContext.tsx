import AdBlockPopup from "@/components/features/ads/AdBlockPopup";
import { debounce, removeDup } from "@/utils";
import { atom, useAtom, useAtomValue } from "jotai";
import { useRouter } from "next/router";
import Script from "next/script";
import React, { useCallback, useEffect, useRef } from "react";

interface AdsContextProps {
  isError: boolean;
  isLoaded: boolean;
}

const stateAtom = atom({
  isError: false,
  isLoaded: false,
});

export const AdsProvider: React.FC = ({ children }) => {
  const [{ isLoaded }, setState] = useAtom(stateAtom);

  const registeredScripts = useRef<string[]>([]);
  const loadedScripts = useRef<string[]>([]);
  const { asPath } = useRouter();

  const handleScriptError = () => {
    setState({ isLoaded: false, isError: true });
  };

  const handleLoad = debounce(() => {
    const registered = removeDup(registeredScripts.current);
    const loaded = removeDup(loadedScripts.current);

    if (registered.length === loaded.length) {
      setState({ isLoaded: true, isError: false });
    }
  }, 500);

  const handleScriptLoad = useCallback(
    (scriptId: string) => {
      if (!registeredScripts.current.includes(scriptId)) {
        registeredScripts.current.push(scriptId);
      }

      return () => {
        loadedScripts.current.push(scriptId);

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

  // Display ads if the page doesn't has any ads
  useEffect(() => {
    if (!isLoaded) return;

    const slotIds = [
      "protag-before_content",
      "protag-in_content",
      "protag-after_content",
      "protag-header",
      "protag-mobile_leaderboard",
    ];

    const pageHasAds = slotIds.some((slotId) =>
      document.querySelector(`#${slotId}`)
    );

    if (!pageHasAds) return;

    // @ts-ignore
    window.googletag = window.googletag || { cmd: [] };
    window.protag = window.protag || { cmd: [] };

    for (const slotId of slotIds) {
      window.protag.cmd.push(function () {
        window.protag.display(slotId);
      });
    }
  }, [asPath, isLoaded]);

  return (
    <React.Fragment>
      <AdBlockPopup />

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
                      const slotIds = ['protag-before_content', 'protag-in_content', 'protag-after_content', 'protag-header', 'protag-sidebar', 'protag-mobile_leaderboard', 'protag-fullwidth']
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
    </React.Fragment>
  );
};

export function useAds(): AdsContextProps {
  return useAtomValue(stateAtom);
}
