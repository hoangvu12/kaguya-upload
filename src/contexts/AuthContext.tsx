import { default as supabase } from "@/lib/supabase";
import { getWithExpiry, setWithExpiry } from "@/utils";
import { User } from "@supabase/supabase-js";
import { atom, useAtom, useAtomValue } from "jotai";
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
  const [user, setUser] = useAtom(userAtom);

  useEffect(() => {
    const getData = async () => {
      const user = supabase.auth.user();

      if (!user) {
        removeCookie();

        return;
      }

      setUser(user);
    };

    getData();
  }, [setUser]);

  // Set cookies on auth state change
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      removeCookie();

      if (!session) {
        setUser(null);

        return;
      }

      if (event === "SIGNED_OUT") {
        setUser(null);
      } else if (event === "SIGNED_IN") {
        setUser(user);
      }

      const token = session.access_token;
      const refreshToken = session.refresh_token;

      nookies.set(null, accessTokenCookieName, token, {
        path: "/",
        maxAge: 604800,
      });

      nookies.set(null, refreshTokenCookieName, refreshToken, {
        path: "/",
        maxAge: 604800,
      });
    });

    return data.unsubscribe;
  }, [setUser, user]);

  return null;
};

export const useUser = () => {
  return useAtomValue(userAtom);
};
