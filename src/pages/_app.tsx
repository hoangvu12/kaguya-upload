import IosAlert from "@/components/features/others/IosAlert";
import BaseLayout from "@/components/layouts/BaseLayout";
import { AppErrorFallback } from "@/components/shared/AppErrorFallback";
import GlobalPlayerContextProvider from "@/contexts/GlobalPlayerContext";
import { pageview } from "@/lib/gtag";
import "@/styles/index.css";
import { logError } from "@/utils/error";
import { Provider } from "jotai";
import { appWithTranslation } from "next-i18next";
import nextI18nextConfig from "next-i18next.config";
import { AppProps } from "next/app";
import Router from "next/router";
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
      staleTime: Infinity,
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

function App({ Component, pageProps, router, err }: WorkaroundAppProps) {
  const [errorInfo, setErrorInfo] = useState<React.ErrorInfo>(null);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      pageview(url);
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.asPath, router.events]);

  useEffect(() => {
    const handleResponse = (e: CustomEvent) => {
      removeEventListener("response-ext_id", handleResponse);

      if (!e.detail) return;

      window.__kaguya__ = { extId: e.detail };
    };

    addEventListener("response-ext_id", handleResponse);

    dispatchEvent(new CustomEvent("request-ext_id"));
  }, []);

  const getLayout =
    // @ts-ignore
    Component.getLayout || ((page) => <BaseLayout>{page}</BaseLayout>);

  return (
    <React.Fragment>
      {/* A placeholder to integrate MAL-Sync (https://github.com/MALSync/MALSync)*/}
      <script id="syncData" type="application/json"></script>

      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        bodyClassName="!bg-background-700"
        toastClassName="!bg-background-700"
      />

      <IosAlert />

      <Provider>
        <QueryClientProvider client={queryClient}>
          <GlobalPlayerContextProvider />

          <ErrorBoundary
            onError={(_, info) => {
              setErrorInfo(info);
            }}
            fallbackRender={(fallbackProps) => {
              return (
                <AppErrorFallback {...fallbackProps} errorInfo={errorInfo} />
              );
            }}
          >
            {getLayout(<Component {...pageProps} err={err} />)}
          </ErrorBoundary>

          {process.env.NODE_ENV === "development" && <ReactQueryDevtools />}
        </QueryClientProvider>
      </Provider>
    </React.Fragment>
  );
}

export default appWithTranslation(App, nextI18nextConfig);

declare global {
  interface Window {
    __kaguya__: { extId: string };
  }
}
