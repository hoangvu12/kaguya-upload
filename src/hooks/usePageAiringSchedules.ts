import { getPageAiringSchedules } from "@/services/anilist";
import { AiringScheduleArgs, Page, PageArgs } from "@/types/anilist";
import { AxiosError } from "axios";
import { useInfiniteQuery, UseInfiniteQueryOptions } from "react-query";

const usePageAiringSchedules = (
  args?: AiringScheduleArgs & PageArgs,
  options?: Omit<
    UseInfiniteQueryOptions<Page, AxiosError, Page>,
    "queryKey" | "queryFn"
  >
) => {
  return useInfiniteQuery<Page>(
    ["airingSchedules", { args }],
    async ({ pageParam = 1 }) => {
      const airingSchedules = await getPageAiringSchedules({
        page: pageParam,
        ...args,
      });

      return airingSchedules;
    },
    {
      getNextPageParam: (lastPage) =>
        lastPage?.pageInfo?.hasNextPage
          ? lastPage.pageInfo.currentPage + 1
          : null,

      ...options,
    }
  );
};

export default usePageAiringSchedules;
