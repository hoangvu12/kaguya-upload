import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { AxiosError } from "axios";
import { useMutation } from "react-query";
import { toast } from "react-toastify";

const useSubtitleDelete = () => {
  return useMutation<any, any, number>(
    async (subtitleId) => {
      const { error } = await supabaseClient
        .from("kaguya_subtitles")
        .delete({ returning: "minimal" })
        .match({ id: subtitleId });

      if (error) {
        throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        toast.success("Subtitle deleted successfully");
      },
      onError: (error: AxiosError) => {
        toast.error(error.message);
      },
    }
  );
};

export default useSubtitleDelete;
