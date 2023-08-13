import { default as supabase } from "@/lib/supabase";
import { getWithExpiry, setWithExpiry } from "@/utils";
import { User } from "@supabase/supabase-js";
import { atom, useAtom, useAtomValue } from "jotai";
import nookies from "nookies";
import { useEffect } from "react";

export const accessTokenCookieName = "sb-access-token";
export const refreshTokenCookieName = "sb-refresh-token";

export const userAtom = atom<User>(null as User);

export const AuthContextProvider = () => {
  // @ts-ignore
  const [user, setUser] = useAtom(userAtom);

  // Check if user session is invalid
  useEffect(() => {
    const currentDate = new Date();
    const session = supabase.auth.session();

    if (!session || currentDate.getMilliseconds() >= session.expires_at) {
      setUser(null);

      nookies.destroy(null, accessTokenCookieName);
      nookies.destroy(null, refreshTokenCookieName);
    }
  }, [setUser]);

  useEffect(() => {
    const getData = async () => {
      const savedUser = getWithExpiry<User>("user");

      if (savedUser) {
        return setUser(savedUser);
      }

      const user = supabase.auth.user();

      setUser(user);
    };

    getData();
  }, [setUser]);

  useEffect(() => {
    const savedUserInfo = getWithExpiry("user");

    if (user) {
      if (savedUserInfo) return;

      setWithExpiry("user", user, 43_200_000); // 12 hours

      return;
    }

    localStorage.removeItem("user");
  }, [user]);

  // Set cookies on auth state change
  useEffect(() => {
    console.log("use effect");

    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("auth change", session);

      if (!session) {
        setUser(null);

        nookies.destroy(null, accessTokenCookieName);
        nookies.destroy(null, refreshTokenCookieName);

        return;
      }

      if (event === "SIGNED_OUT") {
        setUser(null);

        nookies.destroy(null, accessTokenCookieName);
        nookies.destroy(null, refreshTokenCookieName);
      } else if (event === "SIGNED_IN") {
        setUser(user);
      }

      const token = session.access_token;
      const refreshToken = session.refresh_token;

      nookies.destroy(null, accessTokenCookieName);
      nookies.set(null, accessTokenCookieName, token, {
        path: "/",
        maxAge: 604800,
      });

      nookies.destroy(null, refreshTokenCookieName);
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
