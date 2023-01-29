import Script from "next/script";
import nookies from "nookies";
import { useEffect, useState } from "react";

const POPUNDER_COOKIE = "kaguya_popunder";
const USER_COOKIE = "sb-access-token";

const Popunder = () => {
  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    const cookies = nookies.get(null);

    if (cookies[POPUNDER_COOKIE]) return;

    setIsShow(true);
  }, []);

  const handleScriptLoad = () => {
    const cookies = nookies.get(null);

    const isLoggedIn = cookies[USER_COOKIE];

    nookies.set(null, POPUNDER_COOKIE, "1", {
      // 1 day
      maxAge: isLoggedIn ? 1 * 60 * 60 : 24 * 60 * 60,
      path: "/",
    });
  };

  return isShow ? (
    <Script
      data-cfasync="false"
      src="//dnks065sb0ww6.cloudfront.net/?ssknd=974102"
      onLoad={handleScriptLoad}
    ></Script>
  ) : null;
};

export default Popunder;
