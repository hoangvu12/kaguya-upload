import { Attachment, uploadFile, upsertChapter } from "@/services/upload";
import { randomString } from "@/utils";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { SupabaseChapter } from "@/types";

interface UseCreateChapterArgs {
  mediaId: number;
  sourceId: string;
}

interface CreateChapterInput {
  images: File[];
  chapter: {
    title?: string;
    number: number;
  };
}

interface CreateChapterResponse {
  images: Attachment[];
  chapter: SupabaseChapter;
}

const useCreateChapter = (args: UseCreateChapterArgs) => {
  const { sourceId, mediaId } = args;

  const user = useUser();
  const router = useRouter();

  const id = "create-chapter-id";
  const chapterId = randomString(8);

  return useMutation<CreateChapterResponse, Error, CreateChapterInput>(
    async ({ chapter, images }) => {
      if (!chapter?.number) {
        throw new Error("Chapter number is required");
      }

      if (!images?.length) {
        throw new Error("Images is required");
      }

      toast.loading("Uploading images...", {
        toastId: id,
      });

      const uploadedImages = await uploadFile(images);

      if (!uploadedImages?.length) {
        throw new Error("Upload images failed");
      }

      toast.update(id, {
        render: "Creating chapter...",
        type: "info",
        isLoading: true,
      });

      const upsertedChapter = await upsertChapter({
        chapter: {
          ...chapter,
          id: chapterId,
        },
        mediaId,
        sourceId,
      });

      if (!upsertedChapter) throw new Error("Upsert chapter failed");

      toast.update(id, {
        render: "Uploading to database...",
        type: "info",
        isLoading: true,
      });

      const { error } = await supabaseClient.from("kaguya_images").insert({
        chapterId: upsertedChapter.slug,
        images: uploadedImages,
        userId: user.id,
      });

      if (error) {
        throw new Error("Upload failed: " + error.message);
      }

      return {
        images: uploadedImages,
        chapter: upsertedChapter,
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

        router.push(`/manga/${mediaId}/chapters/${sourceId}-${chapterId}`);
      },
    }
  );
};

export default useCreateChapter;
