import Image from "@/components/shared/Image";
import { SearchResult } from "@/types/core";
import classNames from "classnames";
import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  data: SearchResult;
}

const Card: React.FC<CardProps> = (props) => {
  const { data, ...divProps } = props;

  return (
    <div title={data.title} {...divProps}>
      <div className={classNames("relative aspect-w-2 aspect-h-3")}>
        <Image
          src={
            data.thumbnail ||
            "https://s4.anilist.co/file/anilistcdn/media/manga/cover/medium/default.jpg"
          }
          layout="fill"
          objectFit="cover"
          className="rounded-md"
          alt={data.title}
          quality={80}
        />
      </div>

      <p className="mt-1 text-base font-semibold">{data.title}</p>
    </div>
  );
};

export default React.memo(Card) as typeof Card;
