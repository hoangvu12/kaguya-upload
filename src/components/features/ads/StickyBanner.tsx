import Script from "next/script";
import React from "react";

const StickyBanner = () => {
  return (
    <React.Fragment>
      <div id="pf-63e46763ca8fd80027a851ae">
        <Script
          async
          data-cfasync="false"
          src="https://platform.pubfuture.com/v1/unit/63e46763ca8fd80027a851ae.js?v=2"
          type="text/javascript"
        ></Script>
      </div>

      <Script id="sticky" type="text/javascript">
        {`
        window.googletag = window.googletag || { cmd: [] };
        window.protag = window.protag || { cmd: [] };
        window.protag.cmd.push(function () {
            window.protag.display("protag-sticky-bottom");
        });
      `}
      </Script>
    </React.Fragment>
  );
};

export default React.memo(StickyBanner);
