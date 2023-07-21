import { useReadSettings } from "@/contexts/ReadSettingsContext";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import { FileUrl } from "@/types/core";
import classNames from "classnames";
import { motion } from "framer-motion";
import { ImageProps } from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { BsFillImageFill } from "react-icons/bs";

interface ReadImageProps extends Omit<ImageProps, "src"> {
  onVisible?: () => void;
  image: FileUrl;
  loadingClassName?: string;
  containerClassName?: string;
}

const ReadImage: React.FC<ReadImageProps> = ({
  image,
  className,
  loadingClassName,
  onLoad,
  onVisible,
  containerClassName,
  ...props
}) => {
  const [loaded, setLoaded] = useState(false);
  const { fitMode } = useReadSettings();
  const ref = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const entry = useIntersectionObserver(imageRef, {
    rootMargin: "0px 0px 10px 0px",
  });

  useEffect(() => {
    setLoaded(false);
  }, [image]);

  useEffect(() => {
    if (!entry?.isIntersecting) return;
    if (!imageRef.current) return;
    if (!imageRef.current.complete) return;

    onVisible?.();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry?.isIntersecting]);

  // I have to use img instead of Next/Image because I want to image calculate the height itself
  return (
    <React.Fragment>
      {!loaded && (
        <div
          ref={ref}
          className={classNames(
            "flex flex-col gap-2 items-center justify-center w-full h-96 text-gray-500",
            loadingClassName
          )}
        >
          <BsFillImageFill className="w-8 h-8 animate-pulse" />

          <p>Please wait...</p>
        </div>
      )}

      <motion.div
        animate={loaded ? "animate" : "initial"}
        initial="initial"
        exit="exit"
        variants={{
          animate: { opacity: 1, display: "block" },
          initial: { opacity: 0, display: "none" },
        }}
        className={containerClassName}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imageRef}
          className={classNames(
            fitMode === "auto" && "w-auto h-auto",
            fitMode === "width" && "w-full h-auto",
            fitMode === "height" && "w-auto h-screen",
            className
          )}
          alt="Read Manga at Kaguya"
          src={image.url}
          onLoad={(e) => {
            setLoaded(true);

            onLoad?.(e);
          }}
          onError={() => {
            setLoaded(true);
          }}
          {...props}
        />
      </motion.div>
    </React.Fragment>
  );
};

export default React.memo(ReadImage);
