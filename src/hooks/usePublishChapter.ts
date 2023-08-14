import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useMutation } from "react-query";
import { toast } from "react-toastify";

const usePublishChapter = (chapterSlug: string) => {
  return useMutation(
    async () => {
      const { error } = await supabaseClient
        .from("kaguya_chapters")
        .update({ published: true }, { returning: "minimal" })
        .match({ slug: chapterSlug });

      if (error) {
        throw error;
      }

      return true;
    },
    {
      onError: (error: Error) => {
        toast.error(error.message);
      },
      onSuccess: () => {
        toast.success("Publish chapter successfully");
      },
    }
  );
};

export default usePublishChapter;
