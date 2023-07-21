import { getMedia } from "@/services/anilist";
import { Media } from "@/types/anilist";
import { ReadChapter } from "@/types/core";
import { getReadChapters } from "@/utils/chapter";
import { isMobile } from "react-device-detect";
import { useQuery } from "react-query";

export interface ReadChaptersWithMedia extends ReadChapter {
  media: Media;
}

const useRead = () => {
  return useQuery<ReadChaptersWithMedia[]>("read", async () => {
    const readChapters = getReadChapters(isMobile ? 10 : 20);

    if (!readChapters?.length) return [];

    const mediaIds = readChapters.map((readChapter) => readChapter.mediaId);

    const anilistMedia = await getMedia({
      id_in: mediaIds,
    });

    return readChapters.map((read) => {
      const media = anilistMedia.find((media) => media.id === read.mediaId);

      return {
        ...read,
        media,
      };
    });
  });
};

export default useRead;
