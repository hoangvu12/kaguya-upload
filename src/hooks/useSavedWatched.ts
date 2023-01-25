import { useUser } from "@/contexts/AuthContext";
import supabaseClient from "@/lib/supabase";

import { Watched } from "@/types";
import { useQuery } from "react-query";

const useSavedWatched = (animeId: number) => {
  const user = useUser();

  // Use useQuery instead of useSupabaseSingleQuery because useSupabaseSingleQuery doesn't re-render the query.
  return useQuery(
    ["watched", animeId],
    async () => {
      const { data, error } = await supabaseClient
        .from<Watched>("kaguya_watched")
        .select("episode:episodeId(*), watchedTime, episodeNumber")
        .eq("mediaId", animeId)
        .eq("userId", user.id)
        .limit(1)
        .single();

      if (error) throw error;

      return data;
    },
    {
      enabled: !!user,
      refetchOnMount: true,
    }
  );
};

export default useSavedWatched;
