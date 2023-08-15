import Head from "@/components/shared/Head";
import Link from "@/components/shared/Link";
import Logo from "@/components/shared/Logo";
import NavItem from "@/components/shared/NavItem";
import useDevice from "@/hooks/useDevice";
import classNames from "classnames";
import { AnimatePresence, motion, Variants } from "framer-motion";
import React, { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineLogout,
  AiOutlinePlus,
  AiOutlineVideoCameraAdd,
} from "react-icons/ai";
import { BiImageAdd } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import Button from "../shared/Button";
import Popup from "../shared/Popup";
import supabaseClient from "@/lib/supabase";
import { useRouter } from "next/router";
import nookies from "nookies";
import {
  accessTokenCookieName,
  refreshTokenCookieName,
} from "@/contexts/AuthContext";
import { toast } from "react-toastify";

const routes = [
  {
    title: "Home",
    href: "/",
    icon: AiOutlineHome,
  },
  {
    title: "Anime",
    href: "/anime",
    icon: AiOutlineVideoCameraAdd,
  },
  {
    title: "Manga",
    href: "/manga",
    icon: BiImageAdd,
  },
];

const variants: Variants = {
  animate: {
    x: 0,
  },
  initial: {
    x: "-100%",
  },
};

const removeCookie = () => {
  nookies.destroy({}, accessTokenCookieName, { path: "/" });
  nookies.destroy({}, refreshTokenCookieName, { path: "/" });
};

const UploadLayout: React.FC = ({ children }) => {
  const { isMobile } = useDevice();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="w-full min-h-screen flex justify-end">
      <Head title="Upload - Kaguya" />

      {isMobile && isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}

      <AnimatePresence initial={isMobile}>
        <motion.div
          variants={variants}
          transition={{ ease: "linear" }}
          animate={!isMobile || isMenuOpen ? "animate" : ""}
          initial="initial"
          className="h-full w-[70vw] md:w-[20vw] fixed top-0 left-0 bottom-0 z-50 flex flex-col justify-between bg-background-900 p-4"
        >
          <div>
            <Logo />

            <ul>
              <Popup
                type="click"
                placement="bottom-end"
                showArrow
                reference={
                  <Button
                    className="w-full mb-4"
                    iconClassName="w-8 h-8"
                    primary
                    LeftIcon={AiOutlinePlus}
                  >
                    Upload
                  </Button>
                }
              >
                <div className="space-y-1">
                  <Link href="/anime/create">
                    <a>
                      <Button secondary>Upload Anime</Button>
                    </a>
                  </Link>
                  <Link href="/manga/create">
                    <a>
                      <Button secondary>Upload Manga</Button>
                    </a>
                  </Link>
                </div>
              </Popup>

              {routes.map((route) => (
                <NavItem
                  className="block mb-2"
                  href={route.href}
                  key={route.href}
                >
                  {({ isActive }) => (
                    <li
                      className={classNames(
                        "flex items-center space-x-2 transition duration-300 font-semibold px-3 py-2 cursor-pointer rounded-md",
                        isActive ? "bg-white/20" : "hover:bg-white/20"
                      )}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <route.icon className="w-6 h-6" />

                      <p>{route.title}</p>
                    </li>
                  )}
                </NavItem>
              ))}
            </ul>
          </div>

          <Button
            secondary
            onClick={async () => {
              removeCookie();

              const { error } = await supabaseClient.auth.signOut();

              if (error) {
                return toast.error(`Failed to sign out (${error})`);
              }

              router.replace("/login");
            }}
            className={classNames(
              "w-full flex items-center space-x-2 hover:bg-white/20 transition duration-300 font-semibold px-3 py-2 cursor-pointer rounded-md"
            )}
          >
            <AiOutlineLogout className="w-6 h-6" />

            <p>Logout</p>
          </Button>
        </motion.div>
      </AnimatePresence>

      <div className="w-full md:w-4/5 pt-16 pb-4 md:py-12">
        {isMobile && (
          <GiHamburgerMenu
            className="absolute top-4 left-4 w-8 h-8"
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
            }}
          />
        )}

        <div className="relative w-full h-full">{children}</div>
      </div>
    </div>
  );
};

export default UploadLayout;
