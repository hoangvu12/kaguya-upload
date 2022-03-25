import dayjs from "@/lib/dayjs";
import { Room } from "@/types";
import { getTitle } from "@/utils/data";
import Link from "next/link";
import React from "react";
import { AiFillEye } from "react-icons/ai";
import { GoPrimitiveDot } from "react-icons/go";
import Avatar from "./Avatar";
import DotList from "./DotList";
import Image from "./Image";
import TextIcon from "./TextIcon";

interface RoomCardProps {
  room: Room;
}

const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  return (
    <Link href={`/wwf/${room.id}`}>
      <a>
        <div className="w-full h-full space-y-2">
          <div className="relative aspect-w-16 aspect-h-9">
            <Image
              src={room.media.bannerImage}
              alt={getTitle(room.media)}
              layout="fill"
              objectFit="cover"
            />

            <div className="w-full h-full">
              <TextIcon
                LeftIcon={GoPrimitiveDot}
                iconClassName="w-4 h-4"
                className="absolute left-2 top-2 px-2 py-0.5 rounded-md bg-red-500"
              >
                <p className="font-medium">Trực tiếp</p>
              </TextIcon>

              <TextIcon
                RightIcon={AiFillEye}
                className="absolute right-2 top-2 px-2 py-0.5 rounded-md bg-black/80 font-medium"
                iconClassName="w-4 h-4"
              >
                <p>{room.users?.length || 0}</p>
              </TextIcon>

              <p className="absolute right-2 bottom-2 rounded-md bg-black/80 px-2 py-0.5">
                {room.episode.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Avatar src={room.hostUser?.user_metadata?.avatar_url} />

            <div>
              <h3
                className="font-medium line-clamp-2"
                title={getTitle(room.media)}
              >
                {getTitle(room.media)}
              </h3>

              <DotList className="text-sm w-full">
                <span className="font-medium text-gray-200">
                  {room.hostUser?.user_metadata?.name}
                </span>
                <span className="text-gray-300">
                  {dayjs(new Date(room.created_at)).fromNow()}
                </span>
              </DotList>
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default React.memo(RoomCard);
