import classNames from "classnames";
import {
  FullscreenButton,
  TimeIndicator,
  useInteract,
  useVideo,
} from "netplayer";
import { useState, memo, useEffect, useMemo } from "react";
import ProgressSlider from "./ProgressSlider";
import SkipButton from "./SkipButton";

interface MobileControlsProps {
  controlsSlot?: React.ReactNode;
}

const MobileControls: React.FC<MobileControlsProps> = ({ controlsSlot }) => {
  const { isInteracting, isShowingIndicator } = useInteract();
  const { videoState } = useVideo();
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    setScreenWidth(window.innerWidth);

    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const shouldInactive = useMemo(() => {
    return (
      (!videoState.seeking && !isInteracting && !videoState.buffering) ||
      isShowingIndicator
    );
  }, [
    isInteracting,
    isShowingIndicator,
    videoState.buffering,
    videoState.seeking,
  ]);

  return (
    <div
      className={classNames(
        "mobile-controls-container w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-all duration-300",
        shouldInactive ? "opacity-0 invisible" : "opacity-100 visible"
      )}
    >
      <div className="px-4 flex w-full items-center justify-between">
        <TimeIndicator />

        <div className="w-4 h-4">
          <FullscreenButton />
        </div>
      </div>
      <div className="px-4 w-full mt-2">
        <ProgressSlider />
      </div>

      {screenWidth >= 640 && (
        <div className="flex justify-evenly items-center py-6">
          <SkipButton />

          {controlsSlot}
        </div>
      )}
    </div>
  );
};

export default memo(MobileControls);
