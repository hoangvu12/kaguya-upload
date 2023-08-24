import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useMutation } from "react-query";
import { toast } from "react-toastify";

const useChapterDelete = () => {
  return useMutation<any, any, string>(
    async (slug) => {
      const { error } = await supabaseClient
        .from("kaguya_chapters")
        .delete()
        .match({ slug });

      if (error) {
        throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        toast.success("Chapter deleted successfully");
      },
      onError: (error: Error) => {
        toast.error(error.message);
      },
    }
  );
};

export default useChapterDelete;
