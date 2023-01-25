import Banner from "@/components/features/ads/Banner";
import Interstitial from "@/components/features/ads/Interstitial";
import NativeFloater from "@/components/features/ads/NativeFloater";
import Popunder from "@/components/features/ads/Popunder";
import Preload from "@/components/features/ads/Preload";
import InvitePopup from "@/components/features/others/InvitePopup";
import BaseLayout from "@/components/layouts/BaseLayout";
import { AppErrorFallback } from "@/components/shared/AppErrorFallback";
import { AuthContextProvider } from "@/contexts/AuthContext";
import GlobalPlayerContextProvider from "@/contexts/GlobalPlayerContext";
import { SubscriptionContextProvider } from "@/contexts/SubscriptionContext";
import { GA_TRACKING_ID, pageview } from "@/lib/gtag";
import "@/styles/index.css";
import { appWithTranslation } from "next-i18next";
import nextI18nextConfig from "next-i18next.config";
import { AppProps } from "next/app";
import Router, { useRouter } from "next/router";
import Script from "next/script";
import NProgress from "nprogress";
import React, { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { QueryClient, QueryClientProvider } from "react-query";
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
});

interface WorkaroundAppProps extends AppProps {
  err: any;
}

const noAdsRoutes = ["/anime/watch", "/manga/read"];

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

      <Script
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
      />

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

      {showAds && (
        <React.Fragment>
          <Preload />
          <Interstitial />
          <Popunder />
          <NativeFloater />
          <InvitePopup />
          <Banner />
        </React.Fragment>
      )}

      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
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
        </AuthContextProvider>

        {process.env.NODE_ENV === "development" && <ReactQueryDevtools />}
      </QueryClientProvider>
    </React.Fragment>
  );
}

export default appWithTranslation(App, nextI18nextConfig);
