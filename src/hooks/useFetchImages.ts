import { Chapter, FileUrl } from "@/types/core";
import { sendMessage } from "@/utils/events";
import { useQuery } from "react-query";
import { toast } from "react-toastify";

interface MangaImagesProps {
  chapterId: string;
  extraData?: Record<string, string>;
  sourceId: string;
}

export const getQueryKey = (chapter: Chapter, sourceId: string) =>
  `images-${sourceId}-${chapter.id}`;

const useFetchImages = (currentChapter: Chapter, sourceId: string) => {
  return useQuery<FileUrl[], Error>(
    getQueryKey(currentChapter, sourceId),
    async () => {
      const images = await sendMessage<MangaImagesProps, FileUrl[]>(
        "get-images",
        {
          chapterId: currentChapter.id,
          sourceId,
          extraData: currentChapter.extra,
        }
      );

      if (!images?.length) return [];

      console.log("got images", images);

      console.log("updating rules");

      // update rules to apply required headers
      const fileUrls = images.filter((image) => image.headers);

      if (fileUrls?.length) {
        await sendMessage("update-rules", {
          fileUrls,
        });
      }

      console.log("updated rules");

      return images;
    },
    {
      onError: (error) => {
        toast.error(error);
      },
    }
  );
};

export default useFetchImages;
