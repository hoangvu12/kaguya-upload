import { useRouter } from "next/router";
import { useMemo } from "react";

const NativeBanner = () => {
  const { asPath } = useRouter();

  const version = useMemo(() => {
    return Math.round(Math.random() * 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asPath]);

  return (
    <div>
      <script
        data-cfasync="false"
        async
        type="text/javascript"
        src={`//tolterunrout.com/tpLRQoNtTHlHK3dD/61183?v=${version}`}
      ></script>
    </div>
  );
};

export default NativeBanner;
