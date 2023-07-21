import { getMediaDetails } from "@/services/anilist";
import { mediaDefaultFields } from "@/services/anilist/queries";
import { getWatchedEpisodes } from "@/utils/episode";
import { isMobile } from "react-device-detect";
import { useQuery } from "react-query";

const useAnimeRecommendedList = () => {
  return useQuery(["anime", "recommended"], async () => {
    const watchedEpisodes = getWatchedEpisodes(1);

    if (!watchedEpisodes?.length) return null;

    const [watchedEpisode] = watchedEpisodes;

    const media = await getMediaDetails(
      {
        id: watchedEpisode.mediaId,
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
      ...watchedEpisode,
      media,
    };
  });
};

export default useAnimeRecommendedList;
