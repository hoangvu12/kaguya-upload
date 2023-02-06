import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

const scriptId = "native-banner";

const NativeBanner = () => {
  //   const ref = useRef<HTMLDivElement>();
  //   const { asPath } = useRouter();

  //   useEffect(() => {
  //     const script = document.createElement("script");
  //     const divRef = ref.current;

  //     console.log(ref.current);

  //     script.id = scriptId;

  //     script.src = "//tolterunrout.com/tpLRQoNtTHlHK3dD/61183";
  //     script.async = true;
  //     script.setAttribute("data-cfasync", "false");
  //     script.setAttribute("type", "text/javascript");

  //     if (divRef) {
  //       console.log("appened");

  //       divRef.appendChild(script);
  //     }

  //     // return () => {
  //     //   divRef?.removeChild(script);
  //     // };
  //   }, [ref.current]);

  //   return <div ref={ref}></div>;

  return null;
};

export default NativeBanner;
