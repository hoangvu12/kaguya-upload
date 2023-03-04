import Button from "@/components/shared/Button";
import CircleButton from "@/components/shared/CircleButton";
import Image from "@/components/shared/Image";
import { useAds } from "@/contexts/AdsContext";
import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

const AdBlockPopup = () => {
  const { isError } = useAds();
  const [isShow, setIsShow] = useState(true);

  const handleClose = () => {
    setIsShow(false);
  };

  return isError && isShow ? (
    <div className="fixed inset-0 z-[9999]">
      <div
        className="bg-black/60 absolute inset-0 z-40"
        onClick={handleClose}
      ></div>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
        <div className="w-[90vw] md:w-[45rem] md:min-h-[20rem] rounded-xl bg-background-700 p-4">
          <div className="flex gap-4">
            <div className="hidden md:block shrink-0 relative w-52 h-80 bg-background-700 rounded-full">
              <Image
                src="/adblock-hero.png"
                layout="fill"
                className="w-full h-full object-cover"
                unoptimized
                alt="invite hero"
              />

              <div className="bg-gradient-to-b from-transparent via-background-700/60 to-background-700 absolute bottom-0 h-10 w-full"></div>
              <div className="bg-gradient-to-r from-transparent via-background-700/60 to-background-700 absolute right-0 h-full w-10"></div>
            </div>

            <div className="flex flex-col justify-between p-4">
              <div>
                <h1 className="text-4xl font-bold mb-4">
                  Hey there! Please turn off your adblocker!
                </h1>
                <p className="text-lg font-medium mb-8">
                  We know ads can be annoying, but they help us keep the lights
                  on. Please turn off your adblocker to support our site. Thanks
                  a bunch!
                </p>
              </div>

              <div className="flex items-center text-center w-full gap-4">
                <Button
                  className="w-full flex items-center justify-center"
                  primary
                  onClick={handleClose}
                >
                  <p>Ok, I will</p>
                </Button>

                <Button
                  secondary
                  className="w-full flex items-center justify-center"
                  onClick={handleClose}
                >
                  <p>I&apos;d rather not, sorry</p>
                </Button>
              </div>
            </div>
          </div>
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

export default AdBlockPopup;
``;
