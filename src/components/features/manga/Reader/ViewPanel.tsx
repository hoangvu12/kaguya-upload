import Button from "@/components/shared/Button";
import CircleButton from "@/components/shared/CircleButton";
import { useReadInfo } from "@/contexts/ReadContext";
import { useReadPanel } from "@/contexts/ReadPanelContext";
import { useReadSettings } from "@/contexts/ReadSettingsContext";
import useRead from "@/hooks/useRead";
import classNames from "classnames";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { BrowserView, isMobile, MobileView } from "react-device-detect";
import { AiOutlineZoomIn, AiOutlineZoomOut } from "react-icons/ai";
import { BiChevronRight } from "react-icons/bi";
import ImageNavigator from "./ImageNavigator";

const noop = () => {};

const transition = [0.33, 1, 0.68, 1];

const ViewPanel: React.FC = ({ children }) => {
  const {
    state: { isSidebarOpen },
    setState,
  } = useReadPanel();
  const { fitMode, setSetting, zoom } = useReadSettings();
  const { currentChapter, images } = useReadInfo();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSidebarState = (isOpen: boolean) => () => {
    setState((prev) => ({ ...prev, isSidebarOpen: isOpen }));
  };

  const handleMobileClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();

    const target = e.target as HTMLElement;

    const button = target.closest("button");

    if (button?.nodeName === "BUTTON") return;

    handleSidebarState(!isSidebarOpen)();
  };

  const handleZoomLevel = (level: number) => () => {
    if (level >= 1) level = 1;
    if (level <= 0.1) level = 0.1;

    setSetting("zoom", level);
  };

  // Scroll container to top when change chapter
  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.scrollTo({
      top: 0,
    });
  }, [currentChapter]);

  useEffect(() => {
    setState((prev) => ({ ...prev, activeImageIndex: 0 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  return (
    <motion.div
      onClick={isMobile ? handleMobileClick : noop}
      className="content-container relative w-full flex flex-col items-center justify-center bg-background-900"
    >
      <BrowserView className="relative z-50">
        {!isSidebarOpen && (
          <motion.div
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            className="bg-background-800 fixed left-4 top-4 rounded-full"
          >
            <CircleButton
              LeftIcon={BiChevronRight}
              iconClassName="w-8 h-8"
              secondary
              onClick={handleSidebarState(true)}
            />
          </motion.div>
        )}

        {fitMode !== "height" && (
          <motion.div
            whileHover={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ ease: transition, duration: 0.6 }}
            className="fixed top-8 right-16 bg-background-800"
          >
            <Button
              LeftIcon={AiOutlineZoomIn}
              secondary
              className="flex items-center justify-center !rounded-none w-16 h-16"
              onClick={handleZoomLevel(zoom + 0.1)}
            />

            <Button
              LeftIcon={AiOutlineZoomOut}
              secondary
              className="flex items-center justify-center !rounded-none w-16 h-16"
              onClick={handleZoomLevel(zoom - 0.1)}
            />
          </motion.div>
        )}
      </BrowserView>

      <MobileView renderWithFragment>
        <div
          className={classNames(
            "z-40 flex items-center justify-center fixed w-full h-full bg-black/90 transition-all duration-300",
            isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
          )}
        >
          <p className="text-xl font-semibold">Tap here to close the panel</p>
        </div>
      </MobileView>

      <ImageNavigator />

      <div
        className="relative z-30 h-full w-full overflow-y-auto"
        ref={containerRef}
      >
        {children}
      </div>
    </motion.div>
  );
};

export default ViewPanel;
