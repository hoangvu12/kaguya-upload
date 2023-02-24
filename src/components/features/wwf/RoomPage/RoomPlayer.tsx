import { useHistory } from "@/contexts/HistoryContext";
import { useRoomInfo } from "@/contexts/RoomContext";
import {
  RoomPlayerContextProvider,
  useRoomPlayer,
} from "@/contexts/RoomPlayerContext";
import { useFetchSource } from "@/hooks/useFetchSource";
import useVideoSync from "@/hooks/useVideoSync";
import { Episode } from "@/types";
import { parseNumberFromString } from "@/utils";
import { sortMediaUnit } from "@/utils/data";
import classNames from "classnames";
import { useInteract } from "netplayer";
import React, { useCallback, useMemo } from "react";
import { isDesktop } from "react-device-detect";
import { BsArrowLeft } from "react-icons/bs";
import Player from "../../anime/Player";
import MobileOverlay from "../../anime/Player/MobileOverlay";
import Overlay from "../../anime/Player/Overlay";
import TimestampSkipButton from "../../anime/Player/TimestampSkipButton";
import RoomPlayerControls from "./RoomPlayerControls";
import RoomPlayerMobileControls from "./RoomPlayerMobileControls";

const blankVideo = [
  {
    file: "https://cdn.plyr.io/static/blank.mp4",
  },
];

const PlayerOverlay = () => {
  const { isInteracting } = useInteract();
  const { currentEpisode, anime } = useRoomPlayer();
  const { back } = useHistory();

  return (
    <Overlay>
      <BsArrowLeft
        className={classNames(
          "absolute w-10 h-10 transition-al duration-300 cursor-pointer top-10 left-10 hover:text-gray-200",
          isInteracting ? "opacity-100 visible" : "opacity-0 invisible"
        )}
        onClick={back}
      />

      {anime.idMal && (
        <TimestampSkipButton
          episode={parseNumberFromString(currentEpisode.name)}
          malId={anime.idMal}
        />
      )}
    </Overlay>
  );
};

const PlayerMobileOverlay = () => {
  const { isInteracting } = useInteract();
  const { currentEpisode, anime } = useRoomPlayer();
  const { back } = useHistory();

  return (
    <React.Fragment>
      <MobileOverlay>
        <BsArrowLeft
          className={classNames(
            "absolute w-8 h-8 transition-all duration-300 cursor-pointer top-4 left-4 hover:text-gray-200",
            isInteracting ? "opacity-100 visible" : "opacity-0 invisible"
          )}
          onClick={back}
        />
      </MobileOverlay>

      {anime.idMal && (
        <TimestampSkipButton
          episode={parseNumberFromString(currentEpisode.name)}
          malId={anime.idMal}
        />
      )}
    </React.Fragment>
  );
};

const RoomPlayer = () => {
  const playerRef = useVideoSync();
  const { room, socket, basicRoomUser } = useRoomInfo();
  const { data, isLoading } = useFetchSource(room.episode);

  const isHost = useMemo(
    () => basicRoomUser?.userId === room?.hostUserId,
    [basicRoomUser?.userId, room?.hostUserId]
  );

  // const sourceEpisodes = useMemo(
  //   () =>
  //     room.episodes.filter(
  //       (episode) => episode.sourceId === room.episode.sourceId
  //     ),
  //   [room.episodes, room.episode.sourceId]
  // );

  // const currentEpisodeIndex = useMemo(
  //   () =>
  //     sourceEpisodes.findIndex(
  //       (episode) => episode.sourceEpisodeId === room.episode.sourceEpisodeId
  //     ),
  //   [sourceEpisodes, room.episode.sourceEpisodeId]
  // );

  // const nextEpisode = useMemo(
  //   () => sourceEpisodes[currentEpisodeIndex + 1],
  //   [currentEpisodeIndex, sourceEpisodes]
  // );

  const sourceEpisodes = React.useMemo(
    () =>
      room.episodes.filter(
        (episode) => episode.sourceId === room.episode.sourceId
      ),
    [room.episode.sourceId, room.episodes]
  );

  const sectionEpisodes = React.useMemo(
    () =>
      sourceEpisodes.filter(
        (episode) => episode.section === room.episode.section
      ),
    [room.episode.section, sourceEpisodes]
  );

  const currentSectionEpisodeIndex = React.useMemo(
    () =>
      sectionEpisodes.findIndex(
        (episode) => episode.sourceEpisodeId === room.episode.sourceEpisodeId
      ),
    [room.episode.sourceEpisodeId, sectionEpisodes]
  );

  const currentEpisodeIndex = useMemo(
    () =>
      sourceEpisodes.findIndex(
        (episode) => episode.sourceEpisodeId === room.episode.sourceEpisodeId
      ),
    [sourceEpisodes, room.episode.sourceEpisodeId]
  );

  const nextEpisode = React.useMemo(
    () =>
      sectionEpisodes[currentSectionEpisodeIndex + 1] ||
      sourceEpisodes[currentEpisodeIndex + 1],
    [
      currentEpisodeIndex,
      currentSectionEpisodeIndex,
      sectionEpisodes,
      sourceEpisodes,
    ]
  );

  const sortedEpisodes = useMemo(
    () => sortMediaUnit(room.episodes),
    [room.episodes]
  );

  const handleNavigateEpisode = useCallback(
    (episode: Episode) => {
      socket.emit("changeEpisode", episode);

      socket.emit("sendEvent", "changeEpisode");
    },
    [socket]
  );

  const components = useMemo(
    () => ({
      Controls: RoomPlayerControls,
      MobileControls: RoomPlayerMobileControls,
      Overlay: PlayerOverlay,
      MobileOverlay: PlayerMobileOverlay,
    }),
    []
  );

  const hotkeys = useMemo(
    () => [
      {
        fn: () => {
          if (currentSectionEpisodeIndex < sectionEpisodes.length - 1) {
            handleNavigateEpisode(nextEpisode);
          }
        },
        hotKey: "shift+n",
        name: "next-episode",
      },
    ],
    [
      currentSectionEpisodeIndex,
      handleNavigateEpisode,
      nextEpisode,
      sectionEpisodes.length,
    ]
  );

  return (
    <RoomPlayerContextProvider
      value={{
        anime: room.media,
        currentEpisode: room.episode,
        currentEpisodeIndex: currentEpisodeIndex,
        episodes: sortedEpisodes,
        sourceId: room.episode.sourceId,
        sources: data?.sources,
        setEpisode: handleNavigateEpisode,
        isHost,
      }}
    >
      <div className="relative aspect-w-16 aspect-h-9">
        <div>
          <Player
            ref={playerRef}
            sources={isLoading ? blankVideo : data.sources}
            subtitles={data?.subtitles || []}
            fonts={data?.fonts || []}
            className="object-contain w-full h-full"
            components={components}
            hotkeys={hotkeys}
            thumbnail={data?.thumbnail}
            autoPlay
          />
        </div>
      </div>
    </RoomPlayerContextProvider>
  );
};

export default React.memo(RoomPlayer);
