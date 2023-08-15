import { default as supabase } from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";
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
    const removeCookieAndRedirectToLogin = () => {
      removeCookie();

      if (router.asPath === "/login") {
        return;
      }

      router.replace("/login");

      return;
    };

    const getData = async () => {
      if (router.asPath === "/set-password") {
        return;
      }

      const supabaseStorageSession = localStorage.getItem(
        "supabase.auth.token"
      );

      if (!supabaseStorageSession) {
        return removeCookieAndRedirectToLogin();
      }

      const sessionStorage: { currentSession: Session; expiresAt: number } =
        JSON.parse(supabaseStorageSession);

      const user = sessionStorage?.currentSession?.user;

      if (!user) {
        return removeCookieAndRedirectToLogin();
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
