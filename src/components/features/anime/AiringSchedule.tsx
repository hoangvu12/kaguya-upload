import CardSwiper from "@/components/shared/CardSwiper";
import DotList from "@/components/shared/DotList";
import Loading from "@/components/shared/Loading";
import SwiperCard from "@/components/shared/SwiperCard";
import useAiringSchedules from "@/hooks/useAiringSchedules";
import useConstantTranslation from "@/hooks/useConstantTranslation";
import dayjs from "@/lib/dayjs";
import { AiringSchedule, AiringSort } from "@/types/anilist";
import { removeArrayOfObjectDup } from "@/utils";
import classNames from "classnames";
import { useTranslation } from "next-i18next";
import React, { useMemo, useState } from "react";
import { isMobileOnly } from "react-device-detect";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";

const AnimeSchedule = () => {
  const { t } = useTranslation("anime_home");
  const { DAYSOFWEEK } = useConstantTranslation();

  const today = useMemo(() => dayjs(), []);
  const todayIndex = useMemo(() => today.day(), [today]);

  const [selectedTab, setSelectedTab] = useState(todayIndex);

  const selectedDayOfWeek = useMemo(
    () => dayjs().day(selectedTab),
    [selectedTab]
  );

  const airingAt_greater = useMemo(
    () => selectedDayOfWeek.startOf("day").unix(),
    [selectedDayOfWeek]
  );
  const airingAt_lesser = useMemo(
    () => selectedDayOfWeek.endOf("day").unix(),
    [selectedDayOfWeek]
  );

  const { data: schedules, isLoading: schedulesLoading } = useAiringSchedules({
    airingAt_greater,
    airingAt_lesser,
    perPage: isMobileOnly ? 5 : 15,
    sort: [AiringSort.Time_desc],
  });

  const handleTabSelect = (index: number) => {
    setSelectedTab(index);
  };

  return (
    <Tabs
      onSelect={handleTabSelect}
      defaultIndex={todayIndex}
      selectedTabClassName="bg-white !text-black"
    >
      <TabList className="w-5/6 mx-auto flex items-center justify-center flex-wrap gap-x-4 lg:gap-x-8">
        {DAYSOFWEEK.map((day, index) => {
          const isToday = todayIndex === index;

          return (
            <Tab
              key={day}
              className={classNames(
                "px-3 py-2 rounded-[18px] cursor-pointer hover:bg-white hover:text-black transition duration-300",
                isToday && "text-primary-400"
              )}
            >
              {day}
            </Tab>
          );
        })}
      </TabList>

      <div className="mt-20">
        {DAYSOFWEEK.map((day) => {
          return (
            <TabPanel key={day}>
              {schedulesLoading ? (
                <div className="relative h-6 w-full">
                  <Loading />
                </div>
              ) : !schedules?.length ? (
                <p className="text-2xl text-center">Không có...</p>
              ) : (
                <CardSwiper
                  data={removeArrayOfObjectDup(
                    schedules.map((schedule: AiringSchedule) => schedule.media),
                    "id"
                  )}
                  onEachCard={(card, isExpanded) => {
                    const cardWithSchedule = schedules.find(
                      (schedule) => schedule.media.id === card.id
                    );

                    const isReleased = dayjs
                      .unix(cardWithSchedule.airingAt)
                      .isBefore(dayjs());

                    return (
                      <SwiperCard
                        isExpanded={isExpanded}
                        data={card}
                        containerEndSlot={
                          <DotList>
                            <span>
                              {t("common:episode")} {cardWithSchedule.episode}
                            </span>
                            <span>
                              {!isReleased
                                ? dayjs
                                    .unix(cardWithSchedule.airingAt)
                                    .format("HH:mm")
                                : t("airing_schedule_passed")}
                            </span>
                          </DotList>
                        }
                      />
                    );
                  }}
                />
              )}
            </TabPanel>
          );
        })}
      </div>
    </Tabs>
  );
};

export default React.memo(AnimeSchedule);