/* eslint-disable @next/next/no-img-element */
import CircleButton from "@/components/shared/CircleButton";
import React, { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import nookies from "nookies";

const PRELOAD_COOKIE = "kaguya_preload";
const USER_COOKIE = "sb-access-token";

const Preload = () => {
  const [isShow, setIsShow] = useState(false);

  const handleClose = () => {
    setIsShow(false);
  };

  useEffect(() => {
    const cookies = nookies.get(null);
    let shownTime = 0;

    shownTime = Number(cookies?.[PRELOAD_COOKIE]);

    shownTime = isNaN(shownTime) ? 0 : shownTime;

    if (shownTime < 3) {
      nookies.set(null, PRELOAD_COOKIE, String(shownTime + 1), {
        // 30 minutes
        maxAge: 30 * 60,
        path: "/",
      });

      setIsShow(true);

      return;
    }
  }, []);

  return isShow ? (
    <div className="fixed inset-0 z-[9999]">
      <div
        className="bg-black/60 absolute inset-0 z-40"
        onClick={handleClose}
      ></div>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
        <a
          href="https://www.i9bet59.com/Register?a=22608"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src="https://imgyn.imageshh.com/400x300.jpg"
            alt="preload"
            className="min-w-[250px] min-h-[250px]"
          />
        </a>

        <CircleButton
          onClick={handleClose}
          className="!bg-background-600 absolute -top-5 -right-5"
          secondary
          iconClassName="w-8 h-8"
          LeftIcon={AiOutlineClose}
        />
      </div>
    </div>
  ) : null;
};

export default Preload;
