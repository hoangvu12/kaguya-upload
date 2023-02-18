import Interstitial from "@/components/features/ads/Interstitial";
import NativeFloater from "@/components/features/ads/NativeFloater";
import Popunder from "@/components/features/ads/Popunder";
import Preload from "@/components/features/ads/Preload";
import StickyBanner from "@/components/features/ads/StickyBanner";
import BaseLayout from "@/components/layouts/BaseLayout";
import { AppErrorFallback } from "@/components/shared/AppErrorFallback";
import { AdsProvider } from "@/contexts/AdsContext";
import { AuthContextProvider } from "@/contexts/AuthContext";
import GlobalPlayerContextProvider from "@/contexts/GlobalPlayerContext";
import { HistoryProvider } from "@/contexts/HistoryContext";
import { SubscriptionContextProvider } from "@/contexts/SubscriptionContext";
import { pageview } from "@/lib/gtag";
import "@/styles/index.css";
import { logError } from "@/utils/error";
import { appWithTranslation } from "next-i18next";
import nextI18nextConfig from "next-i18next.config";
import { AppProps } from "next/app";
import Router from "next/router";
import Script from "next/script";
import NProgress from "nprogress";
import React, { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

Router.events.on("routeChangeStart", NProgress.start);
Router.events.on("routeChangeComplete", NProgress.done);
Router.events.on("routeChangeError", NProgress.done);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: 1,
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      const errorMessage = (() => {
        if (typeof error === "object") {
          const errorObject: Record<string, any> = { ...error };

          if ("message" in errorObject) {
            return errorObject.message as string;
          }

          if (Object.keys(errorObject).length === 0) {
            return null;
          }

          return JSON.stringify(errorObject) as string;
        }

        if (typeof error === "string") {
          return error;
        }

        return null;
      })();

      const errorSource = (() => {
        if (query.queryKey[0]) {
          return `Query - ${JSON.stringify(query.queryKey)}`;
        }

        return "Query - Unknown";
      })();

      logError({
        error: errorMessage,
        errorSource: errorSource,
      });
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _, __, mutation) => {
      const errorMessage = (() => {
        if (typeof error === "object") {
          const errorObject: Record<string, any> = { ...error };

          if ("message" in errorObject) {
            return errorObject.message as string;
          }

          if (Object.keys(errorObject).length === 0) {
            return null;
          }

          return JSON.stringify(errorObject) as string;
        }

        if (typeof error === "string") {
          return error;
        }

        return null;
      })();

      const errorSource = (() => {
        if (mutation.mutationId) {
          return `Mutation - ${mutation.mutationId}`;
        }

        return "Mutation - Unknown";
      })();

      logError({
        error: errorMessage,
        errorSource: errorSource,
      });
    },
  }),
});

interface WorkaroundAppProps extends AppProps {
  err: any;
}

const noAdsRoutes = ["/anime/watch", "/manga/read", "/upload"];

function App({ Component, pageProps, router, err }: WorkaroundAppProps) {
  const [errorInfo, setErrorInfo] = useState<React.ErrorInfo>(null);
  const [showAds, setShowAds] = useState(true);

  useEffect(() => {
    const handleAdShowing = (url: string) => {
      if (noAdsRoutes.some((route) => url.includes(route))) {
        setShowAds(false);
      } else {
        setShowAds(true);
      }
    };

    const handleRouteChange = (url: string) => {
      pageview(url);
      handleAdShowing(url);
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    handleAdShowing(router.asPath);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.asPath, router.events]);

  const getLayout =
    // @ts-ignore
    Component.getLayout || ((page) => <BaseLayout>{page}</BaseLayout>);

  return (
    <React.Fragment>
      {/* A placeholder to integrate MAL-Sync (https://github.com/MALSync/MALSync)*/}
      <script id="syncData" type="application/json"></script>

      {/* <Script
        // strategy="worker"
        id="google-analytics"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />

      <Script
        id="google-analytics-init"
        // strategy="worker"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            window.gtag = function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      /> */}

      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
          <HistoryProvider>
            <AdsProvider>
              {showAds && (
                <React.Fragment>
                  <Preload />
                  <Interstitial />
                  <Popunder />
                  <NativeFloater />
                  {/* <InvitePopup /> */}
                  <StickyBanner />
                </React.Fragment>
              )}

              <SubscriptionContextProvider>
                <GlobalPlayerContextProvider>
                  <ErrorBoundary
                    onError={(_, info) => {
                      setErrorInfo(info);
                    }}
                    fallbackRender={(fallbackProps) => {
                      return (
                        <AppErrorFallback
                          {...fallbackProps}
                          errorInfo={errorInfo}
                        />
                      );
                    }}
                  >
                    {getLayout(<Component {...pageProps} err={err} />)}
                  </ErrorBoundary>
                </GlobalPlayerContextProvider>
              </SubscriptionContextProvider>
            </AdsProvider>
          </HistoryProvider>
        </AuthContextProvider>

        {process.env.NODE_ENV === "development" && <ReactQueryDevtools />}
      </QueryClientProvider>
    </React.Fragment>
  );
}

export default appWithTranslation(App, nextI18nextConfig);
