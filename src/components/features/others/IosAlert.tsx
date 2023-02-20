import CircleButton from "@/components/shared/CircleButton";
import { useEffect, useState } from "react";
import { isIOS } from "react-device-detect";
import { AiOutlineClose } from "react-icons/ai";
import nookies from "nookies";

const IOS_ALERT_COOKIE = "kaguya_ios_alert";

const NEVER_EXPIRE_TIME = 2147483647;

const IosAlert = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);

    nookies.set(null, IOS_ALERT_COOKIE, "1", {
      maxAge: NEVER_EXPIRE_TIME,
      path: "/",
    });
  };

  useEffect(() => {
    if (!isIOS) return;

    const cookies = nookies.get(null);

    if (!cookies?.[IOS_ALERT_COOKIE]) {
      setShow(true);
    }
  }, []);

  return show ? (
    <div className="fixed inset-0 z-[9999]">
      <div
        className="bg-black/60 absolute inset-0 z-40"
        onClick={handleClose}
      ></div>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
        <div className="text-lg space-y-4 w-[90vw] md:w-[60rem] max-h-[90vh] overflow-y-auto md:min-h-[20rem] rounded-xl bg-background-700 p-4 md:p-8">
          <h1 className="text-2xl font-semibold">Alert for iOS users</h1>

          <p>
            We apologize for any inconvenience, but we would like to inform you
            that our platform currently does not offer full support for iOS
            devices.
          </p>

          <p>
            While we strive to provide the best user experience for all of our
            users, we are currently facing technical limitations that prevent us
            from delivering the same level of functionality on iOS devices as we
            do on other operating systems. We understand that this may be
            disappointing for our iOS users, but please rest assured that we are
            continuously working to improve our platform and expand its
            capabilities on all devices.
          </p>

          <p>
            In the meantime, we recommend that you use our platform on a non-iOS
            device to ensure that you have the best possible experience. Thank
            you for your understanding and we hope to have better news for our
            iOS users in the near future.
          </p>
        </div>

        <CircleButton
          onClick={handleClose}
          className="absolute top-2 right-2"
          secondary
          iconClassName="w-6 h-6"
          LeftIcon={AiOutlineClose}
        />
      </div>
    </div>
  ) : null;
};

export default IosAlert;
