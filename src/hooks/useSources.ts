import { Source } from "@/types/core";
import { sendMessage } from "@/utils/events";
import { useQuery } from "react-query";
import { toast } from "react-toastify";

export enum SourceType {
  Anime = "ANIME",
  Manga = "MANGA",
}

const useSources = (type: SourceType) => {
  return useQuery(["sources", type], async () => {
    const endpoint =
      type === SourceType.Anime ? "get-anime-sources" : "get-manga-sources";

    const sources = await sendMessage<null, Source[]>(endpoint, null);

    if (!sources?.length) {
      toast.error("No sources were found, please check again your extension.");
    }

    return sources || [];
  });
};

export default useSources;
