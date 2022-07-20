import Avatar from "@/components/shared/Avatar";
import Description from "@/components/shared/Description";
import DotList from "@/components/shared/DotList";
import TextIcon from "@/components/shared/TextIcon";
import { useRoomInfo } from "@/contexts/RoomContext";
import { Episode } from "@/types";
import { numberWithCommas } from "@/utils";
import { convert, getDescription, getTitle } from "@/utils/data";
import classNames from "classnames";
import dayjs from "dayjs";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import { MobileView } from "react-device-detect";
import { AiOutlineUser } from "react-icons/ai";
import LocaleEpisodeSelector from "../../anime/Player/LocaleEpisodeSelector";

const MediaBar = () => {
  const { room, socket, basicRoomUser } = useRoomInfo();
  const { locale } = useRouter();
  const { t } = useTranslation("wwf");

  const isHost = useMemo(
    () => basicRoomUser?.userId === room?.hostUserId,
    [basicRoomUser?.userId, room?.hostUserId]
  );

  const mediaTitle = useMemo(
    () => getTitle(room?.media, locale),
    [room?.media, locale]
  );

  const mediaDescription = useMemo(
    () => getDescription(room?.media, locale),
    [locale, room?.media]
  );

  const handleNavigateEpisode = useCallback(
    (episode: Episode) => {
      socket.emit("changeEpisode", episode);

      socket.emit("sendEvent", "changeEpisode");
    },
    [socket]
  );

  return (
    <div className="">
      <div className="relative w-full flex flex-col gap-4">
        <h1 className="text-2xl font-semibold text-primary-300">
          {t("mediaBar.roomDetails")}
        </h1>

        <div className="flex flex-col gap-2">
          <Avatar
            className="!w-16 !h-16"
            src={room.hostUser.user_metadata.avatar_url}
          />

          <div className="space-y-1">
            <h1 className="font-semibold text-xl line-clamp-1 md:line-clamp-none">
              {room.title || mediaTitle}
            </h1>

            <DotList>
              <span className="font-medium text-lg text-gray-200">
                {room.hostUser.user_metadata.name}
              </span>

              <span className="text-sm text-gray-300">
                {dayjs(new Date(room.created_at), { locale }).fromNow()}
              </span>
            </DotList>
          </div>
        </div>

        <TextIcon
          className="absolute top-0 right-0 text-primary-300"
          LeftIcon={AiOutlineUser}
        >
          <p>{numberWithCommas(room.users.length)}</p>
        </TextIcon>
      </div>

      {isHost && (
        <MobileView className="my-8">
          <h1 className="text-2xl font-semibold text-primary-300 mb-4">
            {t("mediaBar.episodeSection")}
          </h1>

          <LocaleEpisodeSelector
            mediaId={room.mediaId}
            episodes={room.episodes}
            activeEpisode={room.episode}
            onEachEpisode={(episode) => (
              <button
                key={episode.sourceEpisodeId}
                className={classNames(
                  "rounded-md bg-background-800 col-span-1 aspect-w-2 aspect-h-1 group",
                  episode.sourceEpisodeId === room.episode?.sourceEpisodeId &&
                    "text-primary-300"
                )}
                onClick={() => handleNavigateEpisode(episode)}
              >
                <div className="flex items-center justify-center w-full h-full group-hover:bg-white/10 rounded-md transition duration-300">
                  <p>{episode.name}</p>
                </div>
              </button>
            )}
          />
        </MobileView>
      )}

      <div className="w-full text-left flex flex-col mt-8">
        <h1 className="mb-4 text-2xl font-semibold text-primary-300">
          {t("mediaBar.animeDetails")}
        </h1>

        <Link href={`/anime/details/${room.media.id}`}>
          <a>
            <h1 className="text-lg font-semibold hover:text-primary-300 transition duration-300">
              [{room.episode.name}] - {mediaTitle}
            </h1>
          </a>
        </Link>

        <DotList className="mt-2 text-base">
          {room.media.genres.map((genre) => (
            <span key={genre}>{convert(genre, "genre", { locale })}</span>
          ))}
        </DotList>

        <Description
          description={mediaDescription}
          className="text-sm mt-4 line-clamp-4 text-gray-300"
        />
      </div>
    </div>
  );
};

export default MediaBar;
