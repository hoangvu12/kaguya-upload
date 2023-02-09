/* eslint-disable @next/next/no-img-element */
import CircleButton from "@/components/shared/CircleButton";
import Image from "@/components/shared/Image";
import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

const StickyBanner = () => {
  const [isShow, setIsShow] = useState(true);

  const handleClose = () => {
    setIsShow(false);
  };

  return isShow ? (
    <div
      className={classNames(
        "z-[9000] flex items-center fixed bottom-4 w-full min-h-[250px]"
      )}
    >
      <div id="pf-63e46763ca8fd80027a851ae">
        <script
          async
          data-cfasync="false"
          src="https://platform.pubfuture.com/v1/unit/63e46763ca8fd80027a851ae.js?v=2"
          type="text/javascript"
        ></script>
      </div>

      <div className="grow" id="pf-63e46736a51c1e002988b2d5">
        <div className="bg-background-400 w-full h-full" />

        <script
          async
          data-cfasync="false"
          src="https://platform.pubfuture.com/v1/unit/63e46736a51c1e002988b2d5.js?v=2"
          type="text/javascript"
        ></script>
      </div>

      <CircleButton
        onClick={handleClose}
        className="!bg-background-600 absolute -top-5 -translate-x-1/2 right-1/4"
        secondary
        iconClassName="w-8 h-8"
        LeftIcon={AiOutlineClose}
        title="Close banner ad"
      />
    </div>
  ) : null;

  return null;
};

export default React.memo(StickyBanner);
