import nookies from "nookies";
import { useEffect } from "react";

const POPUNDER_COOKIE = "kaguya_popunder";

const USER_COOKIE = "sb-access-token";

const Popunder = () => {
  useEffect(() => {
    window.addEventListener("click", () => {
      const cookies = nookies.get(null, "");

      if (cookies[USER_COOKIE]) {
        return;
      }

      if (!cookies[POPUNDER_COOKIE]) {
        const pop = window.open(
          "https://www.highcpmrevenuenetwork.com/ix11ckfx?key=74c92179396e4e64485963798b0f0996",
          "kaguya_popunder"
        );

        pop.blur();

        window.focus();

        nookies.set(null, POPUNDER_COOKIE, "1", {
          // 3 hours
          maxAge: 3 * 60 * 60,
          path: "/",
        });
      }
    });
  }, []);

  return null;
};

export default Popunder;
