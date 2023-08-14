import Button from "@/components/shared/Button";
import Select, {
  Menu,
  MultiValue,
  Option,
  baseStyles,
} from "@/components/shared/Select";
import withUser from "@/hocs/withUser";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Creatable, { useCreatable } from "react-select/creatable";

const RegisterPage = () => {
  const [sourceName, setSourceName] = useState("");
  const [mediaType, setMediaType] = useState([]);
  const [languages, setLanguages] = useState([]);
  const router = useRouter();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      if (!sourceName) {
        return toast.error("Source name is required");
      }

      if (!languages?.length) {
        return toast.error("At least one language is required");
      }

      if (!mediaType?.length) {
        return toast.error("At least one media type is required");
      }

      const composedLanguages = languages.map((language) => language.value);
      const composedMediaTypes = mediaType.map((mediaType) => mediaType.value);

      await axios.post("/api/source", {
        name: sourceName,
        languages: composedLanguages,
        mediaType: composedMediaTypes,
      });

      router.replace("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="space-y-4 w-96 max-w-[90vw]">
        <h1 className="text-3xl">Register your source</h1>

        <form className="w-full" onSubmit={handleSubmit}>
          <label
            htmlFor="name"
            className="block text-white text-base font-bold mb-2"
          >
            Name
          </label>

          <input
            type="text"
            id="name"
            name="name"
            className="w-full px-4 py-3 rounded-md focus:outline-none focus:border-blue-500 bg-background-500 mb-4"
            placeholder="Enter your source name"
            onChange={(e) => setSourceName(e.target.value)}
          />

          <label
            htmlFor="language"
            className="block text-white text-base font-bold mb-2"
          >
            Language
          </label>

          <Creatable
            theme={(theme) => ({
              ...theme,
              colors: {
                ...theme.colors,
                primary: "#ef4444",
                primary75: "#f87171",
                primary50: "#fca5a5",
                primary20: "#fecaca",
              },
            })}
            styles={{
              ...baseStyles,
              control: (provided) => {
                return {
                  ...provided,
                  backgroundColor: "#1a1a1a",
                  width: "100%",
                };
              },
              menuList: (provided) => {
                return {
                  ...provided,
                  backgroundColor: "#1a1a1a",
                };
              },
            }}
            components={{ Option, Menu }}
            isMulti
            onChange={(value) => {
              setLanguages(value as any);
            }}
            noOptionsMessage={() => "Type in to create a new language"}
            value={languages}
            options={languages}
            className="mb-4"
          />

          <label
            htmlFor="language"
            className="block text-white text-base font-bold mb-2"
          >
            Media type
          </label>

          <Select
            styles={{
              ...baseStyles,
              control: (provided) => {
                return {
                  ...provided,
                  backgroundColor: "#1a1a1a",
                  width: "100%",
                };
              },
            }}
            isMulti
            options={[
              { value: "ANIME", label: "Anime" },
              { value: "MANGA", label: "Manga" },
            ]}
            onChange={(value) => {
              setMediaType(value as any);
            }}
            value={mediaType}
            className="mb-8"
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
