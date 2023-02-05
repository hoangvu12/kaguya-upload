import Script from "next/script";
import nookies from "nookies";
import { useEffect, useState } from "react";

const POPUNDER_COOKIE = "kaguya_popunder";
const USER_COOKIE = "sb-access-token";

const Popunder = () => {
  useEffect(() => {
    window.addEventListener(
      "click",
      () => {
        const cookies = nookies.get(null);

        if (cookies[POPUNDER_COOKIE]) return;

        window.open("//dolatiaschan.com/4/5547877", "_blank");

        const isLoggedIn = cookies[USER_COOKIE];

        nookies.set(null, POPUNDER_COOKIE, "1", {
          // 1 day
          maxAge: !isLoggedIn ? 2 * 60 * 60 : 12 * 60 * 60,
          path: "/",
        });
      },
      { once: true }
    );
  }, []);

  // useEffect(() => {
  //   const cookies = nookies.get(null);

  //   if (cookies[POPUNDER_COOKIE]) return;

  //   setIsShow(true);
  // }, []);

  // const handleScriptLoad = () => {
  //   const cookies = nookies.get(null);

  //   const isLoggedIn = cookies[USER_COOKIE];

  //   nookies.set(null, POPUNDER_COOKIE, "1", {
  //     // 1 day
  //     maxAge: isLoggedIn ? 2 * 60 * 60 : 12 * 60 * 60,
  //     path: "/",
  //   });
  // };

  // return isShow ? (
  //   <Script
  //     data-cfasync="false"
  //     src="//dtv5ske218f44.cloudfront.net/?ksvtd=974102"
  //     onLoad={handleScriptLoad}
  //   ></Script>
  // ) : null;

  return null;
};

export default Popunder;
