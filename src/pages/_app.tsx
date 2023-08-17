import BaseLayout from "@/components/layouts/UploadLayout";
import { AppErrorFallback } from "@/components/shared/AppErrorFallback";
import { AuthContextProvider } from "@/contexts/AuthContext";
import "@/styles/index.css";
import { Provider } from "jotai";
import { AppProps } from "next/app";
import Router from "next/router";
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

const queryClient = new QueryClient();

interface WorkaroundAppProps extends AppProps {
  err: any;
}

function App({ Component, pageProps, err }: WorkaroundAppProps) {
  const [errorInfo, setErrorInfo] = useState<React.ErrorInfo>(null);

  const getLayout =
    // @ts-ignore
    Component.getLayout || ((page) => <BaseLayout>{page}</BaseLayout>);

  useEffect(() => {
    const handleResponse = (e: CustomEvent) => {
      removeEventListener("response-ext_id", handleResponse);

      if (!e.detail) return;

      window.__kaguya__ = { extId: e.detail };
    };

    addEventListener("response-ext_id", handleResponse);

    dispatchEvent(new CustomEvent("request-ext_id"));
  }, []);

  return (
    <React.Fragment>
      {/* A placeholder to integrate MAL-Sync (https://github.com/MALSync/MALSync)*/}
      <script id="syncData" type="application/json"></script>

      <ToastContainer
        position="top-center"
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

      <Provider>
        <AuthContextProvider />

        <QueryClientProvider client={queryClient}>
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

declare global {
  interface Window {
    __kaguya__: { extId: string };
  }
}

export default App;
