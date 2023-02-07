import { getAiringSchedules } from "@/services/anilist";
import { AiringSchedule, AiringScheduleArgs, PageArgs } from "@/types/anilist";
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

      return airingSchedules.filter((schedule) => !schedule.media.isAdult);
    },
    options
  );
};

export default useAiringSchedules;
