import Button from "@/components/shared/Button";
import Head from "@/components/shared/Head";
import {
  accessTokenCookieName,
  refreshTokenCookieName,
  userAtom,
} from "@/contexts/AuthContext";
import useSignIn from "@/hooks/useSignIn";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { toast } from "react-toastify";
import nookies from "nookies";
import { useSetAtom } from "jotai";
import { setWithExpiry } from "@/utils";

const removeCookie = () => {
  nookies.destroy({}, accessTokenCookieName, { path: "/" });
  nookies.destroy({}, refreshTokenCookieName, { path: "/" });
};

const LoginPage: NextPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setUser = useSetAtom(userAtom);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error, session, user } = await supabaseClient.auth.signIn({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);

      return;
    }

    const data = { currentSession: session, expiresAt: session.expires_at };

    localStorage.setItem("supabase.auth.token", JSON.stringify(data));

    removeCookie();

    nookies.set(null, accessTokenCookieName, session.access_token, {
      path: "/",
      maxAge: 604800,
    });

    nookies.set(null, refreshTokenCookieName, session.refresh_token, {
      path: "/",
      maxAge: 604800,
    });

    setUser(user);

    router.replace("/");
  };

  return (
    <React.Fragment>
      <Head title={`Login - Kaguya`} />

      <div className="flex flex-col items-center justify-center min-h-screen bg-background-900">
        <div className="max-w-md w-full bg-background-700 rounded-lg px-8 py-6">
          <h2 className="text-2xl font-bold mb-4">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-white text-sm font-bold mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="shadow appearance-none rounded w-full px-4 py-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-background-500"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-white text-sm font-bold mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="shadow appearance-none rounded w-full px-4 py-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-background-500"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button primary type="submit">
              Sign in
            </Button>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
};

// @ts-ignore
LoginPage.getLayout = (page) => page;

export default LoginPage;
