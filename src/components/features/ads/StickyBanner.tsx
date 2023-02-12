/* eslint-disable @next/next/no-img-element */
import Script from "next/script";
import React from "react";

const StickyBanner = () => {
  return (
    <Script id="sticky" type="text/javascript">
      {`
        window.googletag = window.googletag || { cmd: [] };
        window.protag = window.protag || { cmd: [] };
        window.protag.cmd.push(function () {
            window.protag.display("protag-sticky-bottom");
        });
      `}
    </Script>
  );
};

export default React.memo(StickyBanner);
