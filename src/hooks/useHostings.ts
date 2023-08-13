import { Hosting } from "@/types";
import { useQuery } from "react-query";
import { sendMessage } from "@/utils/events";

const useHostings = () => {
  return useQuery("video-hostings", async () => {
    const hostings = await sendMessage<null, Hosting[]>("get-video-hostings");

    return hostings;
  });
};

export default useHostings;
