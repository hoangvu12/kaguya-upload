import Description from "@/components/shared/Description";
import DotList from "@/components/shared/DotList";
import InfoItem from "@/components/shared/InfoItem";
import Link from "@/components/shared/Link";
import PlainCard from "@/components/shared/PlainCard";
import TextIcon from "@/components/shared/TextIcon";
import { Media } from "@/types/anilist";
import { createMediaDetailsUrl, numberWithCommas } from "@/utils";
import { getTitle, getDescription, convert } from "@/utils/data";
import classNames from "classnames";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { AiFillHeart } from "react-icons/ai";
import { MdTagFaces } from "react-icons/md";

interface MediaDetailsProps {
  media: Media;
  className?: string;
}

const MediaDetails: React.FC<MediaDetailsProps> = ({ media, className }) => {
  const { t } = useTranslation();
  const { locale } = useRouter();

  const title = useMemo(() => getTitle(media, locale), [media, locale]);
  const description = useMemo(
    () => getDescription(media, locale),
    [media, locale]
  );

  return (
    <div
      className={classNames(
        "w-full p-8 bg-background-900 text-center md:text-left flex flex-col md:flex-row items-start gap-4",
        className
      )}
    >
      <div className="w-[183px] shrink-0 mx-auto md:mx-0">
        <Link href={createMediaDetailsUrl(media)}>
          <a>
            <PlainCard src={media.coverImage.extraLarge} alt={title} />
          </a>
        </Link>
      </div>

      <div className="w-full space-y-8 md:space-y-4">
        <Link href={createMediaDetailsUrl(media)}>
          <a>
            <h1 className="text-2xl font-semibold hover:text-primary-300 transition duration-300">
              {title}
            </h1>
          </a>
        </Link>

        <p className="text-gray-300">{media.title.native}</p>

        <div className="flex flex-wrap items-center justify-center md:justify-start text-lg gap-x-8">
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

        <div className="flex space-x-8 w-full overflow-x-auto snap-x snap-mandatory md:space-x-16">
          <InfoItem title={t("common:country")} value={media.countryOfOrigin} />

          {media.episodes && (
            <InfoItem
              title={t("common:total_episodes")}
              value={media.episodes}
            />
          )}

          {media.chapters && (
            <InfoItem
              title={t("common:total_chapters")}
              value={media.chapters}
            />
          )}

          {media.duration && (
            <InfoItem
              title={t("common:duration")}
              value={`${media.duration} ${t("common:minutes")}`}
            />
          )}

          <InfoItem
            title={t("common:status")}
            value={convert(media.status, "status", { locale })}
          />

          <InfoItem
            title={t("common:age_rated")}
            value={media.isAdult ? "18+" : ""}
          />
        </div>

        <Description
          description={description}
          className="text-gray-300 line-clamp-5"
        />
      </div>
    </div>
  );
};

export default MediaDetails;
