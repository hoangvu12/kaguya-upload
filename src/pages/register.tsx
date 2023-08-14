import Button from "@/components/shared/Button";
import withUser from "@/hocs/withUser";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { toast } from "react-toastify";

const RegisterPage = () => {
  const [sourceName, setSourceName] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      await axios.post("/api/source", { name: sourceName });

      router.replace("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="space-y-4 w-96 max-w-[90vw]">
        <h1 className="text-3xl">Register your source</h1>

        <form className="space-y-4 w-full" onSubmit={handleSubmit}>
          <input
            type="text"
            id="name"
            name="name"
            className="w-full px-4 py-3 rounded-md focus:outline-none focus:border-blue-500 bg-background-500"
            placeholder="Enter your source name"
            onChange={(e) => setSourceName(e.target.value)}
          />
          <Button type="submit" className="ml-auto" primary>
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export const getServerSideProps = withUser();

export default RegisterPage;
