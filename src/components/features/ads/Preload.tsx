/* eslint-disable @next/next/no-img-element */

const Preload = () => {
  // const [isShow, setIsShow] = useState(false);

  // const { asPath } = useRouter();

  // const showPreload = () => {
  //   const cookies = nookies.get(null);

  //   if (cookies?.[USER_COOKIE]) return;

  //   let shownTime = 0;

  //   shownTime = Number(cookies?.[PRELOAD_COOKIE]);

  //   shownTime = isNaN(shownTime) ? 0 : shownTime;

  //   if (shownTime < 1) {
  //     nookies.set(null, PRELOAD_COOKIE, String(shownTime + 1), {
  //       // 4 hours
  //       maxAge: 4 * 60 * 60,
  //       path: "/",
  //     });

  //     setIsShow(true);

  //     return;
  //   }
  // };

  // const handleClose = () => {
  //   setIsShow(false);
  // };

  // useEffect(() => {
  //   showPreload();
  // }, [asPath]);

  // return isShow ? (
  //   <div className="fixed inset-0 z-[9999]">
  //     <div
  //       className="bg-black/60 absolute inset-0 z-40"
  //       onClick={handleClose}
  //     ></div>

  //     <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
  //       <a
  //         href="https://www.i9bet59.com/Register?a=22608"
  //         target="_blank"
  //         rel="noreferrer"
  //         className="block max-w-[80vw] w-[500px] aspect-w-4 aspect-h-3"
  //       >
  //         <img
  //           src="https://i.imgur.com/JoKwRGP.jpg"
  //           alt="preload"
  //           className="w-full h-full"
  //         />
  //       </a>

  //       <CircleButton
  //         onClick={handleClose}
  //         className="!bg-background-600 absolute -top-5 -right-5"
  //         secondary
  //         iconClassName="w-8 h-8"
  //         LeftIcon={AiOutlineClose}
  //       />
  //     </div>
  //   </div>
  // ) : null;

  return null;
};

export default Preload;
