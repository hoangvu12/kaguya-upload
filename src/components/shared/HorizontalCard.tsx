import Link from "@/components/shared/Link";
import { Media } from "@/types/anilist";
import classNames from "classnames";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import DotList from "./DotList";
import PlainCard from "./PlainCard";

interface HorizontalCardProps extends React.HTMLAttributes<HTMLDivElement> {
  data: Media;
  redirectUrl?: string;
  endSlot?: React.ReactNode;
  cardContainerClassName?: string;
  size?: "sm" | "md" | "lg";
}

const HorizontalCard = ({
  data,
  className,
  redirectUrl,
  endSlot,
  cardContainerClassName,
  size = "sm",
  ...props
}: HorizontalCardProps) => {
  const { locale } = useRouter();

  const title = data.title.userPreferred;

  const sizeClassName = useMemo(() => {
    if (size === "sm") {
      return {
        card: "w-12",
        title: "text-base",
        info: "text-sm",
        genres: "text-sm",
        container: "gap-2",
      };
    }

    if (size === "md") {
      return {
        card: "w-16",
        title: "text-lg",
        info: "text-sm",
        genres: "text-sm",
        container: "gap-3",
      };
    }

    if (size === "lg") {
      return {
        card: "w-20",
        title: "text-xl",
        info: "text-base",
        genres: "text-base",
        container: "gap-4",
      };
    }
  }, [size]);

  return (
    <div
      className={classNames(
        "flex min-h-[6rem] items-center py-2",
        className,
        sizeClassName.container
      )}
      {...props}
    >
      <div
        className={classNames(
          "shrink-0",
          cardContainerClassName,
          sizeClassName.card
        )}
      >
        <Link href={redirectUrl}>
          <a>
            <PlainCard src={data.coverImage.extraLarge} alt={title} />
          </a>
        </Link>
      </div>

      <div className="space-y-1 self-start">
        <Link href={redirectUrl}>
          <a>
            <p
              className={classNames(
                "font-semibold text-white transition duration-300 line-clamp-1 hover:text-primary-300",
                sizeClassName.title
              )}
            >
              {title}
            </p>
          </a>
        </Link>

        <DotList className={classNames("text-gray-300", sizeClassName.info)}>
          {data.format && <span>{data.format || "Unknown"}</span>}

          {data.season && data.seasonYear && (
            <span>
              {data.season} {data.seasonYear}
            </span>
          )}

          {data.status && <span>{data.status}</span>}
        </DotList>

        <DotList className={classNames("text-gray-300", sizeClassName.genres)}>
          {data.genres?.map((genre) => (
            <span key={genre}>{genre}</span>
          ))}
        </DotList>

        {endSlot}
      </div>
    </div>
  );
};

export default React.memo(HorizontalCard);
