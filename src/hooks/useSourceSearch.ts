import { Media, MediaType } from "@/types/anilist";
import { SearchResult } from "@/types/core";
import { sendMessage } from "@/utils/events";
import { UseQueryOptions, useQuery } from "react-query";
import { toast } from "react-toastify";

type SearchProps = {
  sourceId: string;
  anilist: Media;
  query?: string;
};

const useSourceSearch = (
  {
    anilist,
    mediaType,
    sourceId,
    query,
  }: SearchProps & {
    mediaType: MediaType;
  },
  options?: Omit<
    UseQueryOptions<SearchResult[], Error, SearchResult[], any>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery(
    ["source-search", anilist.id, sourceId, mediaType, query],
    async () => {
      const endpoint =
        mediaType === MediaType.Anime ? "search-anime" : "search-manga";

      const searchResults = await sendMessage<SearchProps, SearchResult[]>(
        endpoint,
        {
          sourceId,
          anilist,
          query,
        }
      );

      return searchResults;
    },
    {
      onError: (err) => {
        toast.error(err.message);
      },
      ...options,
    }
  );
};

export default useSourceSearch;
