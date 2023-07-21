import Image from "@/components/shared/Image";
import classNames from "classnames";
import { ImageProps } from "next/image";
import React from "react";

const PlainCard: React.FC<ImageProps> = ({ className, ...props }) => {
  return (
    <div className="relative aspect-w-2 aspect-h-3">
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <Image
        layout="fill"
        objectFit="cover"
        quality={80}
        className={classNames("rounded-md", className)}
        {...props}
      />
    </div>
  );
};

export default React.memo(PlainCard);
