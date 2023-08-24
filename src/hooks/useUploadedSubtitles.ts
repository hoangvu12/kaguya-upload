import { useUser } from "@/contexts/AuthContext";
import { MediaSubtitle } from "@/types";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useQuery } from "react-query";

interface UseUploadedsubtitlesOptions {
  mediaId: number;
}

const useUploadedsubtitles = ({ mediaId }: UseUploadedsubtitlesOptions) => {
  const user = useUser();

  return useQuery(
    ["uploaded-subtitles", mediaId],
    async () => {
      console.log(user);

      if (!user) throw new Error("Not logged in");

      const { data, error } = await supabaseClient
        .from<MediaSubtitle>("kaguya_subtitles")
        .select("*")
        .eq("userId", user?.id)
        .eq("mediaId", mediaId);

      if (error) {
        return [];
      }

      if (!data?.length) {
        return [];
      }

      return data;
    },
    {
      refetchOnMount: true,
      enabled: !!user?.id,
    }
  );
};

export default useUploadedsubtitles;
