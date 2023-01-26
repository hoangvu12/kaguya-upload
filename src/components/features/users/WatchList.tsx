import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";
import InView from "@/components/shared/InView";
import List from "@/components/shared/List";
import Loading from "@/components/shared/Loading";
import ListSkeleton from "@/components/skeletons/ListSkeleton";
import useConstantTranslation from "@/hooks/useConstantTranslation";
import useWatchList, { STATUS, Status } from "@/hooks/useWatchList";
import { AdditionalUser } from "@/types";
import { parseTime } from "@/utils";
import classNames from "classnames";
import dayjs from "dayjs";
import { useTranslation } from "next-i18next";
import React, { useMemo, useState } from "react";

interface WatchListProps {
  user: AdditionalUser;
}

const WatchList: React.FC<WatchListProps> = ({ user }) => {
  const { WATCH_STATUS } = useConstantTranslation();

  type WatchStatus = (typeof WATCH_STATUS)[number];

  const getStatus = (status: Status) => {
    return WATCH_STATUS.find((watchStatus) => watchStatus.value === status);
  };

  const [activeTab, setActiveTab] = useState<WatchStatus>(
    getStatus(STATUS.Current)
  );
  const { t } = useTranslation("common");

  const {
    data: watchList,
    isError,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useWatchList(activeTab.value as Status, user);

  const handleFetch = () => {
    if (isFetchingNextPage || !hasNextPage) return;

    fetchNextPage();
  };

  const handleChangeTab = (status: Status) => () => {
    setActiveTab(getStatus(status));
  };

  const totalData = useMemo(
    () => watchList?.pages.map((el) => el.data).flat(),
    [watchList?.pages]
  );

  return (
    <div>
      <div className="snap-x overflow-x-auto flex items-center gap-3">
        {WATCH_STATUS.map((status) => (
          <Button
            key={status.value}
            className={classNames(
              activeTab.value === status.value
                ? "bg-primary-600"
                : "bg-background-500"
            )}
            onClick={handleChangeTab(status.value as Status)}
          >
            {status.label}
          </Button>
        ))}
      </div>

      <div className="mt-8">
        {isLoading ? (
          <div className="min-h-[2rem] w-full relative">
            <Loading />
          </div>
        ) : (
          <React.Fragment>
            <List data={totalData}>
              {(node) => {
                const durationTime = node.duration * 60;

                const watchProgressPercent =
                  durationTime === 0
                    ? 0
                    : (node.watchedTime / durationTime) * 100;

                const now = dayjs();

                const nextEpisodeAiringTime = !node.nextAiringEpisode
                  ? null
                  : dayjs.unix(node.nextAiringEpisode.airingAt);

                let nextEpisodeAiringTimeDuration = "";

                if (nextEpisodeAiringTime) {
                  nextEpisodeAiringTimeDuration = dayjs
                    .duration(nextEpisodeAiringTime.diff(now))
                    .format("D[d] H[h] m[m]");
                }

                const airedEpisodes = node.nextAiringEpisode
                  ? node.nextAiringEpisode.episode - 1
                  : null;

                return (
                  <Card
                    imageEndSlot={
                      <React.Fragment>
                        <div className="z-[5] flex flex-col justify-end absolute inset-0">
                          {node.nextAiringEpisode && (
                            <p className="ml-2 mb-1 px-1 py-0.5 rounded-md bg-background-700 w-max">
                              EP {node.nextAiringEpisode.episode}:{" "}
                              {nextEpisodeAiringTimeDuration}
                            </p>
                          )}

                          <div className="flex justify-between">
                            <p className="ml-2 mb-2 px-1 py-0.5 rounded-md bg-background-700">
                              {airedEpisodes
                                ? `${
                                    node.watchedEpisode
                                  } / ${airedEpisodes} / ${
                                    node.episodes || "??"
                                  }`
                                : `${node.watchedEpisode} / ${
                                    node.episodes || "??"
                                  }`}
                            </p>

                            <p className="mr-2 mb-2 px-1 py-0.5 rounded-md bg-background-700">
                              {parseTime(node.watchedTime)}
                            </p>
                          </div>

                          <div
                            className="h-1 bg-primary-500"
                            style={{ width: `${watchProgressPercent}%` }}
                          />
                        </div>

                        <div className="z-0 flex flex-col justify-end absolute inset-0">
                          <div className="h-32 bg-gradient-to-t from-black/80 to-transparent z-40"></div>
                        </div>
                      </React.Fragment>
                    }
                    data={node}
                  />
                );
              }}
            </List>

            {isFetchingNextPage && !isError && (
              <div className="mt-4">
                <ListSkeleton />
              </div>
            )}

            {((totalData.length && !isFetchingNextPage) || hasNextPage) && (
              <InView onInView={handleFetch} />
            )}

            {!hasNextPage && !!totalData.length && (
              <p className="mt-8 text-2xl text-center">
                {t("no_list_results")}
              </p>
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default WatchList;
