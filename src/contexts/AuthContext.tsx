import { default as supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { useRouter } from "next/router";
import nookies from "nookies";
import { useEffect } from "react";

export const accessTokenCookieName = "sb-access-token";
export const refreshTokenCookieName = "sb-refresh-token";

export const userAtom = atom<User>(null as User);

const removeCookie = () => {
  nookies.destroy({}, accessTokenCookieName, { path: "/" });
  nookies.destroy({}, refreshTokenCookieName, { path: "/" });
};

export const AuthContextProvider = () => {
  // @ts-ignore
  const setUser = useSetAtom(userAtom);
  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      const user = supabase.auth.user();

      console.log("getData", user);

      if (!user) {
        removeCookie();

        if (router.asPath === "/login") {
          return;
        }

        router.replace("/login");

        return;
      }

      setUser(user);
    };

    getData();
  }, [router, setUser]);

  return null;
};

export const useUser = () => {
  return useAtomValue(userAtom);
};
