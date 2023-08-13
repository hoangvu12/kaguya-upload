import Button from "@/components/shared/Button";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import { toast } from "react-toastify";

const SetPasswordPage: NextPage = () => {
  const [password, setPassword] = React.useState("");
  const [rePassword, setRePassword] = React.useState("");

  const router = useRouter();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (!password || !rePassword) {
      toast.error("Passwords are required");

      return;
    }

    if (password !== rePassword) {
      toast.error("Passwords do not match");

      return;
    }

    const { error } = await supabaseClient.auth.update({ password });

    if (error) {
      toast.error(error.message);

      return;
    }

    router.replace("/");
  };

  return (
    <div className="w-full min-h-screen h-full flex items-center justify-center bg-background-900">
      <div className="max-w-md w-full">
        <div className="py-10 px-8 shadow-md rounded-lg bg-background-700">
          <h1 className="text-2xl font-bold mb-6">Set Password</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                className="block text-white text-sm font-bold mb-2"
                htmlFor="password"
              >
                New Password
              </label>
              <input
                className="bg-background-500 w-full px-4 py-3 rounded-md focus:outline-none focus:border-blue-500"
                type="password"
                id="password"
                name="password"
                placeholder="Enter your new password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-white text-sm font-bold mb-2"
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <input
                className="bg-background-500 w-full px-4 py-3 rounded-md focus:outline-none focus:border-blue-500"
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your new password"
                onChange={(e) => setRePassword(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Button primary type="submit">
                Set Password
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// @ts-ignore
SetPasswordPage.getLayout = (children) => {
  return <React.Fragment>{children}</React.Fragment>;
};

SetPasswordPage.getInitialProps = ({ query }) => {
  console.log(query);

  return { query };
};

export default SetPasswordPage;
