import BaseButton from "@/components/shared/BaseButton";
import Image from "@/components/shared/Image";
import classNames from "classnames";
import { useMemo, useState } from "react";
import { isMobileOnly } from "react-device-detect";
import AIChatBox from "./AIChatBox";
import CircleButton from "@/components/shared/CircleButton";
import { AiOutlineClose } from "react-icons/ai";

const AIFloatingButton = () => {
  const [showChatBox, setShowChatBox] = useState(false);

  const handleClick = () => {
    setShowChatBox(!showChatBox);
  };

  const shouldShowBaseButton = useMemo(() => {
    if (!isMobileOnly) return true;

    return !showChatBox;
  }, [showChatBox]);

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      {shouldShowBaseButton && (
        <BaseButton
          className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:w-16 lg:w-20 lg:h-20 rounded-full bg-background-700"
          title="Your AI Assistant"
          onClick={handleClick}
        >
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16">
            <Image src="/ai.png" alt="maid-chan" layout="fill" />
          </div>
        </BaseButton>
      )}

      <div
        className={classNames(
          "transition-[opacity, visibility] duration-300 z-[9999]",
          isMobileOnly ? "fixed inset-0" : "absolute bottom-full mb-2 right-0",
          showChatBox ? "visible opacity-100" : "invisible opacity-0"
        )}
      >
        <CircleButton
          className="absolute top-2 right-2 z-50"
          iconClassName="w-6 h-6"
          LeftIcon={AiOutlineClose}
          onClick={handleClick}
          secondary
        />

        <AIChatBox />
      </div>

      {showChatBox && (
        <div className="fixed inset-0 z-[9000]" onClick={handleClick}></div>
      )}
    </div>
  );
};

export default AIFloatingButton;
