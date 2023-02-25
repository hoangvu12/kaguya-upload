import { default as supabase, default as supabaseClient } from "@/lib/supabase";
import { AdditionalUser } from "@/types";
import { atom, useAtomValue, useSetAtom } from "jotai";
import nookies from "nookies";
import React, { useEffect } from "react";

const accessTokenCookieName = "sb-access-token";
const refreshTokenCookieName = "sb-refresh-token";

const userAtom = atom<AdditionalUser>(null as AdditionalUser);

export const AuthContextProvider = () => {
  // @ts-ignore
  const setUser = useSetAtom(userAtom);

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
      const user = supabase.auth.user();

      if (!user) return;

      const { data: profileUser } = await supabaseClient
        .from<AdditionalUser>("users")
        .select("*")
        .eq("id", user.id)
        .single();

      setUser(profileUser);
    };

    getData();
  }, [setUser]);

  // Set cookies on auth state change
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
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
        const { data: profileUser } = await supabaseClient
          .from<AdditionalUser>("users")
          .select("*")
          .eq("id", session.user.id)
          .single();

        setUser(profileUser);
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
  }, [setUser]);

  return null;
};

export const useUser = () => {
  return useAtomValue(userAtom);
};
