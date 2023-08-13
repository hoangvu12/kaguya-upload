import { SupabaseChapter } from "@/types";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { PostgrestError } from "@supabase/supabase-js";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";

const useUpdateChapter = (chapterSlug: string) => {
  const client = useQueryClient();

  return useMutation<
    SupabaseChapter[],
    PostgrestError,
    Partial<SupabaseChapter>
  >(
    async (updateValue) => {
      const { data, error } = await supabaseClient
        .from<SupabaseChapter>("kaguya_chapters")
        .update(updateValue)
        .match({ slug: chapterSlug });

      if (error) throw error;

      return data;
    },
    {
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess: () => {
        toast.success("Chapter updated");

        client.invalidateQueries(["uploaded-chapter", chapterSlug]);
      },
    }
  );
};

export default useUpdateChapter;
