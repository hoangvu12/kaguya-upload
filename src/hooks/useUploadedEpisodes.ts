import { AnimeSourceConnection, SupabaseEpisode } from "@/types";
import { Episode } from "@/types/core";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useQuery, useQueryClient } from "react-query";

interface UseUploadedEpisodesOptions {
  mediaId: number;
  sourceId: string;
}

type EpisodeWithPublishStatus = Episode & {
  published: boolean;
  supabaseEpisode: SupabaseEpisode;
};

const useUploadedEpisodes = ({
  mediaId,
  sourceId,
}: UseUploadedEpisodesOptions) => {
  const queryClient = useQueryClient();

  return useQuery(
    ["uploaded-episodes", { mediaId, sourceId }],
    async () => {
      const { data, error } = await supabaseClient
        .from<AnimeSourceConnection>("kaguya_anime_source")
        .select(
          `
            mediaId,
            episodes:kaguya_episodes(
                *,
                video:kaguya_videos(*)
            )
        `
        )
        .eq("sourceId", sourceId)
        .eq("mediaId", mediaId)
        .single();

      if (error) {
        return [];
      }

      if (!data?.episodes?.length) {
        return [];
      }

      return data.episodes;
    },
    {
      onSuccess(data) {
        data.forEach((episode) => {
          queryClient.setQueryData(["uploaded-episode", episode.slug], episode);
        });
      },
      refetchOnMount: true,
    }
  );
};

export default useUploadedEpisodes;
