import Description from "@/components/shared/Description";
import DotList from "@/components/shared/DotList";
import PlainCard from "@/components/shared/PlainCard";
import TextIcon from "@/components/shared/TextIcon";
import { Media } from "@/types/anilist";
import { numberWithCommas } from "@/utils";
import classNames from "classnames";
import React from "react";
import { isMobileOnly } from "react-device-detect";
import { AiFillHeart } from "react-icons/ai";
import { MdTagFaces } from "react-icons/md";

interface MediaDetailsProps {
  media: Media;
  className?: string;
}

const MediaDetails: React.FC<MediaDetailsProps> = ({ media, className }) => {
  const title = media.title.userPreferred;
  const description = media.description;

  return (
    <div
      className={classNames(
        "w-full p-8 bg-background-900 flex flex-col items-start gap-4",
        className
      )}
    >
      <div className="flex gap-4">
        <div className="w-[120px] md:w-[186px] shrink-0 mx-auto md:mx-0">
          <PlainCard src={media.coverImage.extraLarge} alt={title} />
        </div>

        <div className="space-y-4">
          <h1 className="text-2xl font-semibold hover:text-primary-300 transition duration-300">
            {title}
          </h1>

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
                <span key={genre}>{genre}</span>
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
