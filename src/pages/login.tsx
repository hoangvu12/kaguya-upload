import Button from "@/components/shared/Button";
import Head from "@/components/shared/Head";
import useSignIn from "@/hooks/useSignIn";
import { Provider } from "@supabase/gotrue-js";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";

const isDev = process.env.NODE_ENV === "development";

const LoginPage: NextPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { query } = useRouter();

  const { redirectedFrom = "/" } = query as { redirectedFrom: string };

  const signInMutation = useSignIn({
    redirectTo: isDev
      ? `http://localhost:3000${redirectedFrom}`
      : redirectedFrom,
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    signInMutation.mutate({ email, password });
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
                className="shadow appearance-none rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-background-500"
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
                className="shadow appearance-none rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-background-500"
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
