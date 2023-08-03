import Description from "@/components/shared/Description";
import DotList from "@/components/shared/DotList";
import Link from "@/components/shared/Link";
import PlainCard from "@/components/shared/PlainCard";
import TextIcon from "@/components/shared/TextIcon";
import { Media } from "@/types/anilist";
import { createMediaDetailsUrl, numberWithCommas } from "@/utils";
import { convert, getDescription, getTitle } from "@/utils/data";
import classNames from "classnames";
import React, { useMemo } from "react";
import { isMobileOnly } from "react-device-detect";
import { AiFillHeart } from "react-icons/ai";
import { MdTagFaces } from "react-icons/md";
import { titleTypeAtom } from "./TitleSwitcher";
import { useAtomValue } from "jotai";

interface MediaDetailsProps {
  media: Media;
  className?: string;
}

const MediaDetails: React.FC<MediaDetailsProps> = ({ media, className }) => {
  const titleType = useAtomValue(titleTypeAtom);

  const title = useMemo(() => getTitle(media, titleType), [media, titleType]);
  const description = useMemo(() => getDescription(media), [media]);

  return (
    <div
      className={classNames(
        "w-full p-8 bg-background-900 flex flex-col items-start gap-4",
        className
      )}
    >
      <div className="flex gap-4">
        <div className="w-[120px] md:w-[186px] shrink-0 mx-auto md:mx-0">
          <Link href={createMediaDetailsUrl(media)}>
            <a>
              <PlainCard src={media.coverImage.extraLarge} alt={title} />
            </a>
          </Link>
        </div>

        <div className="space-y-4">
          <Link href={createMediaDetailsUrl(media)}>
            <a>
              <h1 className="text-2xl font-semibold hover:text-primary-300 transition duration-300">
                {title}
              </h1>
            </a>
          </Link>

          <p className="text-gray-300">{media.title.native}</p>

          <div className="flex flex-wrap items-center text-lg gap-y-2 gap-x-8">
            {media.averageScore && (
              <TextIcon LeftIcon={MdTagFaces} iconClassName="text-green-300">
                <p>{media.averageScore}%</p>
              </TextIcon>
            )}

            <TextIcon LeftIcon={AiFillHeart} iconClassName="text-red-400">
              <p>{numberWithCommas(media.favourites)}</p>
            </TextIcon>

            <DotList>
              {media.genres.map((genre) => (
                <span key={genre}>{convert(genre, "genre")}</span>
              ))}
            </DotList>
          </div>

          {!isMobileOnly && (
            <div className="w-full space-y-8 md:space-y-4">
              <Description
                description={description}
                className="text-gray-300"
              />
            </div>
          )}
        </div>
      </div>

      {isMobileOnly && (
        <div className="w-full space-y-8 md:space-y-4">
          <Description description={description} className="text-gray-300" />
        </div>
      )}
    </div>
  );
};

export default MediaDetails;
