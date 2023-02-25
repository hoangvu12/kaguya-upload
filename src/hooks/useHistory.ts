import { useRouter } from "next/router";
import { useCallback } from "react";

const useHistory = () => {
  const router = useRouter();

  const back = useCallback(() => {
    if (typeof window !== "undefined" && +window?.history?.state?.idx > 0) {
      router.back();

      return;
    }

    router.push("/");
  }, [router]);

  return {
    back,
  };
};

export default useHistory;
