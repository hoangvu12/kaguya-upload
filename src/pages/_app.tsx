import Banner from "@/components/features/ads/Banner";
import BaseLayout from "@/components/layouts/BaseLayout";
import { AppErrorFallback } from "@/components/shared/AppErrorFallback";
import { AuthContextProvider } from "@/contexts/AuthContext";
import GlobalPlayerContextProvider from "@/contexts/GlobalPlayerContext";
import { SubscriptionContextProvider } from "@/contexts/SubscriptionContext";
import { initBanners, initPopunder } from "@/lib/ads";
import { GA_TRACKING_ID, pageview } from "@/lib/gtag";
import "@/styles/index.css";
import * as Sentry from "@sentry/nextjs";
import { appWithTranslation } from "next-i18next";
import nextI18nextConfig from "next-i18next.config";
import { AppProps } from "next/app";
import Router from "next/router";
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

function App({ Component, pageProps, router, err }: WorkaroundAppProps) {
  const [errorInfo, setErrorInfo] = useState<React.ErrorInfo>(null);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      pageview(url);

      initBanners();
    };

    initBanners();
    initPopunder();

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  const getLayout =
    // @ts-ignore
    Component.getLayout || ((page) => <BaseLayout>{page}</BaseLayout>);

  return (
    <React.Fragment>
      {/* A placeholder to integrate MAL-Sync (https://github.com/MALSync/MALSync)*/}
      <script id="syncData" type="application/json"></script>

      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />

      <Script id="google-analytics" strategy="afterInteractive">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
        `}
      </Script>

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
          <SubscriptionContextProvider>
            <GlobalPlayerContextProvider>
              <ErrorBoundary
                onError={(error, info) => {
                  if (process.env.NODE_ENV === "production") {
                    Sentry.captureException(error);
                  }
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

      <Banner />
    </React.Fragment>
  );
}

export default appWithTranslation(App, nextI18nextConfig);
