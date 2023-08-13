import DotList from "@/components/shared/DotList";
import Image from "@/components/shared/Image";
import Link from "@/components/shared/Link";
import TextIcon from "@/components/shared/TextIcon";
import { Media } from "@/types/anilist";
import { isColorVisible, numberWithCommas } from "@/utils";
import { Options } from "@popperjs/core";
import classNames from "classnames";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { AiFillHeart } from "react-icons/ai";
import { MdTagFaces } from "react-icons/md";
import Description from "./Description";
import Popup from "./Popup";

interface CardProps {
  data: Media;
  className?: string;
  containerEndSlot?: React.ReactNode;
  imageEndSlot?: React.ReactNode;
  redirectUrl?: string;
  showType?: boolean;
}

const popupOptions: Partial<Options> = {
  strategy: "absolute",

  modifiers: [
    {
      name: "sameWidth",
      enabled: true,
      fn: ({ state }) => {
        state.styles.popper.height = `${state.rects.reference.height}px`;
        state.styles.popper.width = `${state.rects.reference.width * 3}px`;
      },
      phase: "beforeWrite",
      requires: ["computeStyles"],
      effect({ state }) {
        const { width, height } =
          state.elements.reference.getBoundingClientRect();

        state.elements.popper.style.width = `${width * 3}px`;

        state.elements.popper.style.height = `${height}px`;
      },
    },
  ],
};

const Card: React.FC<CardProps> = (props) => {
  const { data, className, imageEndSlot, redirectUrl, showType } = props;

  const router = useRouter();

  const primaryColor = useMemo(
    () =>
      data.coverImage?.color && isColorVisible(data.coverImage.color, "#3a3939")
        ? data.coverImage.color
        : "white",
    [data]
  );

  const title = data.title.userPreferred;

  const description = data.description;

  const nextEpisodeAiringTimeDuration = useMemo(() => {
    const nextEpisodeAiringTime = !data.nextAiringEpisode
      ? null
      : dayjs.unix(data.nextAiringEpisode.airingAt);

    if (nextEpisodeAiringTime) {
      return dayjs
        .duration(nextEpisodeAiringTime.diff(dayjs()))
        .format("D[d] H[h] m[m]");
    }

    return "";
  }, [data.nextAiringEpisode]);

  return (
    <Link href={redirectUrl}>
      <a>
        <Popup
          reference={
            <React.Fragment>
              <div
                className={classNames(
                  "relative aspect-w-2 aspect-h-3",
                  className
                )}
              >
                <Image
                  src={data.coverImage?.extraLarge}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                  alt={title}
                  quality={80}
                />

                <div className="z-[5] flex flex-col justify-end absolute inset-0">
                  {data.nextAiringEpisode && (
                    <p className="ml-2 mb-1 px-1 py-0.5 rounded-md bg-background-700 w-max">
                      EP {data.nextAiringEpisode.episode}:{" "}
                      {nextEpisodeAiringTimeDuration}
                    </p>
                  )}

                  {imageEndSlot}
                </div>

                <div className="z-0 flex flex-col justify-end absolute inset-0">
                  <div className="h-32 bg-gradient-to-t from-black/80 to-transparent z-40"></div>
                </div>
              </div>

              {showType && (
                <p className="mt-2 uppercase font-medium text-sm text-gray-300 italic">
                  {data.type}
                </p>
              )}

              <p
                className="mt-1 text-base font-semibold line-clamp-2"
                style={{ color: primaryColor }}
              >
                {title}
              </p>
            </React.Fragment>
          }
          options={popupOptions}
          offset={[0, 10]}
          className="overflow-hidden z-10 relative p-4 rounded-md shadow-[rgba(0,0,0,0.25)_0px_54px_55px,rgba(0,0,0,0.12)_0px_-12px_30px,rgba(0,0,0,0.12)_0px_4px_6px,rgba(0,0,0,0.17)_0px_12px_13px,rgba(0,0,0,0.09)_0px_-3px_5px]"
        >
          <Image
            src={data.bannerImage || data.coverImage?.extraLarge}
            objectFit="cover"
            className="rounded-md shadow-2xl"
            alt={title}
            layout="fill"
            quality={80}
          />

          <div className="absolute inset-0 bg-black/70"></div>

          <div className="absolute inset-0 p-6 flex flex-col justify-end">
            <p
              className="text-2xl mb-3 font-semibold line-clamp-1"
              style={{ color: primaryColor }}
            >
              {title}
            </p>

            <Description
              description={description}
              className="text-gray-300 hover:text-gray-100 transition duration-300 line-clamp-3 mb-2"
            />

            <DotList className="mb-2">
              {data.genres?.map((genre) => (
                <span
                  className="text-sm font-semibold"
                  style={{
                    color: primaryColor,
                  }}
                  key={genre}
                >
                  {genre}
                </span>
              ))}
            </DotList>

            <div className="relative z-50 flex items-center space-x-2">
              {data.averageScore && (
                <TextIcon LeftIcon={MdTagFaces} iconClassName="text-green-300">
                  <p>{data.averageScore}%</p>
                </TextIcon>
              )}

              <TextIcon LeftIcon={AiFillHeart} iconClassName="text-red-400">
                <p>{numberWithCommas(data.favourites)}</p>
              </TextIcon>
            </div>
          </div>
        </Popup>
      </a>
    </Link>
  );
};

export default React.memo(Card) as typeof Card;
