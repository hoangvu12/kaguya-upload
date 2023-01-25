import { useUser } from "@/contexts/AuthContext";
import supabaseClient from "@/lib/supabase";

import { Read } from "@/types";
import { useQuery } from "react-query";

const useSavedRead = (mangaId: number) => {
  const user = useUser();

  // Use useQuery instead of useSupabaseSingleQuery because useSupabaseSingleQuery doesn't re-render the query.
  return useQuery(
    ["read", mangaId],
    async () => {
      const { data, error } = await supabaseClient
        .from<Read>("kaguya_read")
        .select("chapter:chapterId(*)")
        .eq("mediaId", mangaId)
        .eq("userId", user.id)
        .limit(1)
        .single();

      if (error) throw error;

      return data;
    },
    {
      enabled: !!user,
      retry: 0,
    }
  );
};

export default useSavedRead;
