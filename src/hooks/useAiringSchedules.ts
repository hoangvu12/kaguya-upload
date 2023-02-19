import { getAiringSchedules } from "@/services/anilist";
import { AiringSchedule, AiringScheduleArgs, PageArgs } from "@/types/anilist";
import { removeArrayOfObjectDup } from "@/utils";
import { AxiosError } from "axios";
import { useQuery, UseQueryOptions } from "react-query";

const useAiringSchedules = (
  args?: AiringScheduleArgs & PageArgs,
  options?: Omit<
    UseQueryOptions<AiringSchedule[], AxiosError, AiringSchedule[]>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<AiringSchedule[]>(
    ["airingSchedules", { args }],
    async () => {
      const airingSchedules = await getAiringSchedules(args);

      return removeArrayOfObjectDup(
        airingSchedules.filter((schedule) => !schedule.media.isAdult),
        "mediaId"
      );
    },
    options
  );
};

export default useAiringSchedules;
