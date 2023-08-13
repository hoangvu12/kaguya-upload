import { SupabaseEpisode } from "@/types";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useQuery } from "react-query";

const useUploadedEpisode = (episodeSlug: string) => {
  return useQuery(["uploaded-episode", episodeSlug], async () => {
    const { data, error } = await supabaseClient
      .from<SupabaseEpisode>("kaguya_episodes")
      .select(
        `
            *,
            video:kaguya_videos(*)
        `
      )
      .eq("slug", episodeSlug)
      .single();

    if (error) {
      console.log("uploaded episode", error);

      return null;
    }

    return data;
  });
};

export default useUploadedEpisode;
