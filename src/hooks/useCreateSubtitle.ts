import { useUser } from "@/contexts/AuthContext";
import { Attachment, uploadFile } from "@/services/upload";
import { UploadSubtitle } from "@/types";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";

interface UseCreateSubtitleArgs {
  mediaId: number;
  sourceId: string;
}

interface CreateSubtitleInput {
  subtitles: UploadSubtitle[];
  fonts: File[];
}

const useCreateSubtitle = (args: UseCreateSubtitleArgs) => {
  const { mediaId, sourceId } = args;

  const user = useUser();
  const router = useRouter();
  const queryClient = useQueryClient();

  const id = "create-subtitle-id";

  return useMutation<any, Error, CreateSubtitleInput>(
    async ({ fonts, subtitles }) => {
      if (!user?.id) {
        throw new Error("Can't find user data, please relogin");
      }

      if (!subtitles?.length) {
        throw new Error("At least one subtitle is required");
      }

      let uploadedFonts: Attachment[] = [];

      toast.loading("Uploading subtitles...", {
        toastId: id,
      });

      const uploadedSubtitles: Attachment[] = await uploadFile(
        subtitles.map((subtitle) => subtitle.file),
        subtitles.map((subtitle) => ({
          name: subtitle.name,
          locale: subtitle.locale,
        }))
      );

      if (fonts?.length) {
        toast.update(id, {
          render: "Uploading fonts...",
          type: "info",
          isLoading: true,
        });

        uploadedFonts = await uploadFile(fonts);
      }

      if (subtitles?.length && !uploadedSubtitles.length) {
        throw new Error("Upload subtitles failed");
      }

      if (fonts?.length && !uploadedFonts.length) {
        throw new Error("Upload fonts failed");
      }

      toast.update(id, {
        render: "Saving to database...",
        type: "info",
        isLoading: true,
      });

      const upsertData: {
        file: Attachment;
        userId: string;
        language: string;
        fonts: Attachment[];
        mediaId: number;
        sourceId: string;
      }[] = uploadedSubtitles.map((subtitle) => ({
        file: subtitle,
        fonts: uploadedFonts,
        language: subtitle.ctx.name,
        mediaId,
        userId: user.id,
        sourceId,
      }));

      const { error } = await supabaseClient
        .from("kaguya_subtitles")
        .upsert(upsertData);

      if (error) {
        throw new Error("Upload failed " + error.message);
      }

      return {
        subtitles: uploadedSubtitles,
        fonts: uploadedFonts,
      };
    },
    {
      onError: (error) => {
        toast.update(id, {
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });

        toast.error(error.message, { autoClose: 3000 });
      },
      onSuccess: () => {
        toast.update(id, {
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });

        toast.success("Upload successfully", { autoClose: 3000 });

        queryClient.invalidateQueries(["uploaded-subtitles", mediaId]);

        router.push(`/anime/${mediaId}`);
      },
    }
  );
};

export default useCreateSubtitle;
