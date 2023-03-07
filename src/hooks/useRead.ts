import supabaseClient from "@/lib/supabase";

import { useUser } from "@/contexts/AuthContext";
import { getMedia } from "@/services/anilist";
import { Read } from "@/types";
import { MediaType } from "@/types/anilist";
import { useQuery } from "react-query";

const useRead = () => {
  const user = useUser();

  return useQuery<Read[]>(
    "read",
    async () => {
      const { data, error } = await supabaseClient
        .from<Read>("kaguya_read")
        .select(
          "mediaId, chapter:kaguya_chapters!chapterId(sourceChapterId, name, sourceId)"
        )
        .eq("userId", user.id)
        .order("updated_at", { ascending: false })
        .limit(10);

      if (error) throw error;

      const anilistMedia = await getMedia({
        id_in: data.map((read) => read.mediaId),
        type: MediaType.Manga,
      });

      return data.map((read) => {
        const media = anilistMedia.find((media) => media.id === read.mediaId);

        return {
          ...read,
          media,
        };
      });
    },
    { enabled: !!user }
  );
};

export default useRead;
