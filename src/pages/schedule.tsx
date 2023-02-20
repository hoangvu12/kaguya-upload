import Button from "@/components/shared/Button";
import Head from "@/components/shared/Head";
import HorizontalCard from "@/components/shared/HorizontalCard";
import InView from "@/components/shared/InView";
import Link from "@/components/shared/Link";
import Loading from "@/components/shared/Loading";
import Section from "@/components/shared/Section";
import Swiper, {
  SwiperInstance,
  SwiperSlide,
} from "@/components/shared/Swiper";
import useAiringSchedules from "@/hooks/useAiringSchedules";
import useConstantTranslation from "@/hooks/useConstantTranslation";
import usePageAiringSchedules from "@/hooks/usePageAiringSchedules";
import { createMediaDetailsUrl, groupBy } from "@/utils";
import classNames from "classnames";
import dayjs, { Dayjs } from "dayjs";
import { useTranslation } from "next-i18next";
import React from "react";
import { useEffect, useMemo, useState } from "react";
import { isMobileOnly } from "react-device-detect";
import { BsFillPlayFill } from "react-icons/bs";

const SchedulePage = () => {
  const { DAYSOFWEEK } = useConstantTranslation();
  const { t } = useTranslation();
  const [swiper, setSwiper] = useState<SwiperInstance>(null);

  const today = useMemo(() => dayjs(), []);

  const [activeDay, setActiveDay] = useState<Dayjs>(today);

  const airingAt_greater = useMemo(
    () => activeDay.startOf("day").unix(),
    [activeDay]
  );
  const airingAt_lesser = useMemo(
    () => activeDay.endOf("day").unix(),
    [activeDay]
  );

  const {
    data: schedulePage,
    isLoading,
    isFetchingNextPage,
    isError,
    hasNextPage,
    fetchNextPage,
  } = usePageAiringSchedules({
    airingAt_greater,
    airingAt_lesser,
    perPage: 50,
  });

  const schedules = useMemo(() => {
    if (!schedulePage?.pages?.length) return null;

    return schedulePage.pages.flatMap((page) => page.airingSchedules);
  }, [schedulePage]);

  const days = useMemo(() => {
    const aWeeksAgo = dayjs().subtract(1, "week");

    const days: dayjs.Dayjs[] = [];
    for (let i = 0; i < 14; i++) {
      days.push(aWeeksAgo.add(i, "day"));
    }

    return days;
  }, []);

  const handleSwiperInit = (swiper: SwiperInstance) => {
    setSwiper(swiper);
  };

  const schedulesWithTime = useMemo(() => {
    if (!schedules?.length) return {};

    const schedulesWithTime = groupBy(schedules, (schedule) => {
      return schedule.airingAt.toString();
    });

    return schedulesWithTime;
  }, [schedules]);

  const handleFetch = () => {
    if (isFetchingNextPage || !hasNextPage) return;

    fetchNextPage();
  };

  useEffect(() => {
    if (!swiper) return;

    const activeDayIndex = days.findIndex((day) =>
      day.isSame(activeDay, "day")
    );

    if (activeDayIndex === -1) return;

    swiper.slideTo(activeDayIndex);
  }, [activeDay, days, swiper]);

  return (
    <React.Fragment>
      <Head
        title="Airing Schedule - Kaguya"
        description="Stay up-to-date with the latest anime episodes and air dates on our Anime Airing Schedule page. Plan your viewing schedule with ease using our comprehensive list of currently airing anime series"
      />

      <Section className="pt-36">
        <Swiper
          slidesPerGroup={1}
          centeredSlides
          breakpoints={{
            1536: {
              slidesPerView: 7,
              spaceBetween: 20,
            },
            1280: {
              slidesPerView: 6,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 5,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
            640: {
              slidesPerView: 3,
              spaceBetween: 10,
            },
            0: {
              slidesPerView: 2,
              spaceBetween: 10,
            },
          }}
          centeredSlidesBounds
          onInit={handleSwiperInit}
        >
          {days.map((day) => (
            <SwiperSlide key={day.unix()}>
              <div
                onClick={() => setActiveDay(day)}
                className="w-full aspect-w-2 aspect-h-1"
              >
                <div
                  className={classNames(
                    "w-full h-full flex flex-col items-center justify-center rounded-md",
                    day.isSame(activeDay, "day")
                      ? "bg-primary-500"
                      : "bg-background-800"
                  )}
                >
                  <p className="text-gray-100 font-medium text-sm">
                    {day.format("L")}
                  </p>
                  <p className="text-lg font-semibold">
                    {DAYSOFWEEK[day.day()]}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="relative mt-8 min-h-[10rem]">
          {isLoading ? (
            <Loading />
          ) : (
            <div className="space-y-4">
              <p className="text-lg text-gray-300 italic text-center md:text-left">
                The airing schedule is synced with your local time.
              </p>

              <div>
                {Object.entries(schedulesWithTime).map(([time, list]) => {
                  const airingAt = Number(time);

                  const day = dayjs.unix(airingAt);

                  const isReleased = day.isBefore(dayjs());

                  return (
                    <div className="relative" key={time}>
                      <div className="ml-4 flex items-center">
                        <p
                          className={classNames(
                            "absolute left-0 h-1.5 w-1.5 rounded-full",
                            isReleased ? "bg-primary-500" : "bg-gray-600"
                          )}
                        />

                        <p className="text-gray-300 font-semibold text-xl">
                          {day.format("HH:mm")}
                        </p>
                      </div>

                      <div className="relative">
                        <div className="ml-4 space-y-2">
                          {list.map((schedule) => (
                            <div
                              className="flex flex-col md:flex-row md:justify-between last:pb-4"
                              key={schedule.mediaId}
                            >
                              <HorizontalCard
                                data={schedule.media}
                                key={schedule.mediaId}
                                endSlot={
                                  <p className="text-sm text-gray-300">
                                    {t("common:episode")} {schedule.episode}
                                  </p>
                                }
                                cardContainerClassName="!w-16 md:!w-24 lg:!w-32"
                                size={isMobileOnly ? "md" : "lg"}
                              />

                              {!isMobileOnly && (
                                <Link
                                  href={createMediaDetailsUrl(schedule.media)}
                                >
                                  <a>
                                    <Button
                                      primary
                                      LeftIcon={BsFillPlayFill}
                                      className="relative min-w-[12rem]"
                                    >
                                      <p className="w-full absolute left-1/2 -translate-x-1/2">
                                        {t("common:episode")} {schedule.episode}
                                      </p>
                                    </Button>
                                  </a>
                                </Link>
                              )}
                            </div>
                          ))}
                        </div>

                        <p
                          className={classNames(
                            "absolute translate-x-full top-1/2 -translate-y-1/2 h-full w-0.5",
                            isReleased ? "bg-primary-500" : "bg-gray-600"
                          )}
                        ></p>
                      </div>
                    </div>
                  );
                })}

                {isFetchingNextPage && !isError && (
                  <div className="relative mt-4 min-h-[10rem]">
                    <Loading />
                  </div>
                )}

                {((schedules.length && !isFetchingNextPage) || hasNextPage) && (
                  <InView onInView={handleFetch} />
                )}

                {!hasNextPage && !!schedules.length && (
                  <p className="mt-8 text-2xl text-center">
                    {t("common:no_list_results")}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </Section>
    </React.Fragment>
  );
};

export default SchedulePage;
