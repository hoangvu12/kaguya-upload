import { createUploadService } from "@/services/upload";
import { useQuery } from "react-query";

const useVideoStatus = (fileId: string, hostingId: string) => {
  const { getVideoStatus } = createUploadService(hostingId);

  return useQuery(["video-status", fileId], () => getVideoStatus(fileId), {
    enabled: !!fileId,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    onError: console.error,
  });
};

export default useVideoStatus;
