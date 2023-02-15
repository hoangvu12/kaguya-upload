import { GA_TRACKING_ID } from "@/lib/gtag";
import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  public render() {
    return (
      <Html>
        <Head>
          <meta httpEquiv="Cache-Control" content="max-age=200" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <link rel="icon" href="/favicon.ico" type="image/ico" />

          {/* <script
            data-partytown-config
            dangerouslySetInnerHTML={{
              __html: `
                partytown = {
                  lib: "/_next/static/~partytown/",
                  forward: ["gtag", "dataLayer.push"]
                };
              `,
            }}
          /> */}

          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          />
          <script
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              });
            `,
            }}
          />

          <meta
            name="exoclick-site-verification"
            content="993454f71337139b039882b0e72c7ed8"
          />

          {/* <!--Google GPT/ADM code --> */}
          <script
            type="text/javascript"
            async
            src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"
          ></script>

          <script type="text/javascript">
            {`
              window.googletag = window.googletag || { cmd: [] };
              window.googletag.cmd.push(function () {
                window.googletag.pubads().enableSingleRequest(); 
                window.googletag.enableServices();
              })
            `}
            ;
          </script>

          {/* <!--Site config --> */}
          <script
            type="text/javascript"
            async
            src="https://protagcdn.com/s/kaguya.live/site.js"
          ></script>

          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: `
                window.protag = window.protag || { cmd: [] };
                window.protag.config = { s: "kaguya.live", childADM: "22874911193", l: "Arf30PQf" };
                window.protag.cmd.push(function () {
                    console.log('pageInit')

                    window.protag.pageInit();
                })
              `,
            }}
          ></script>

          {process.env.NODE_ENV == "development" && (
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.googletag = window.googletag || { cmd: [] };
                  window.googletag.cmd.push(function () {
                      const slotIds = ['protag-before_content', 'protag-in_content', 'protag-after_content', 'protag-header', 'protag-sidebar']
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
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
