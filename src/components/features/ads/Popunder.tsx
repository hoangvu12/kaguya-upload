import Script from "next/script";
import nookies from "nookies";
import { useEffect, useState } from "react";

const POPUNDER_COOKIE = "kaguya_popunder";

const Popunder = () => {
  // const [isShow, setIsShow] = useState(false);

  // useEffect(() => {
  //   const cookies = nookies.get(null);

  //   if (cookies[POPUNDER_COOKIE]) return;

  //   setIsShow(true);
  // }, []);

  // const handleScriptLoad = () => {
  //   nookies.set(null, POPUNDER_COOKIE, "1", {
  //     // 30 minutes
  //     maxAge: 60 * 30,
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
