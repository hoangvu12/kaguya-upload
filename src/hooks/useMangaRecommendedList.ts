import { getMediaDetails } from "@/services/anilist";
import { mediaDefaultFields } from "@/services/anilist/queries";
import { getReadChapters } from "@/utils/chapter";
import { isMobile } from "react-device-detect";
import { useQuery } from "react-query";

const useMangaRecommendedList = () => {
  return useQuery(["manga", "recommended"], async () => {
    const readChapters = getReadChapters(1);

    if (!readChapters?.length) return null;

    const [readChapter] = readChapters;

    const media = await getMediaDetails(
      {
        id: readChapter.mediaId,
        perPage: 1,
      },
      `
        title {
          romaji
          english
          native
          userPreferred
        }
        recommendations(sort: [RATING_DESC, ID], perPage: ${
          isMobile ? 5 : 10
        }) {
          nodes {
            mediaRecommendation {
              ${mediaDefaultFields}
            }
          }
        }
        `
    );

    return {
      ...readChapter,
      media,
    };
  });
};

export default useMangaRecommendedList;
