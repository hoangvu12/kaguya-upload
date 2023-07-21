import { getMedia } from "@/services/anilist";
import { mediaDefaultFields } from "@/services/anilist/queries";
import { Media, MediaArgs, PageArgs } from "@/types/anilist";
import { AxiosError } from "axios";
import { UseQueryOptions, useQuery } from "react-query";

const useMedia = (
  args: MediaArgs & PageArgs,
  options?: Omit<
    UseQueryOptions<Media[], AxiosError, Media[]>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<Media[]>(
    ["media", { args }],
    () => getMedia(args, mediaDefaultFields),
    options
  );
};

export default useMedia;
