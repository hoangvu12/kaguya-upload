import React, { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { ThemeSettingsContextProvider } from "@/contexts/ThemeSettingsContext";
import { fetchRandomTheme, useAnimeTheme } from "@/hooks/useAnimeTheme";
import { ThemePlayerContextProvider } from "@/contexts/ThemePlayerContext";
import Head from "@/components/shared/Head";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";

const ThemePlayer = dynamic(
  () => import("@/components/features/themes/ThemePlayer"),
  { ssr: false }
);

const blankVideo = [
  {
    file: "https://cdn.plyr.io/static/blank.mp4",
  },
];

interface ThemesPageProps {
  slug: string;
  type: string;
}

const ThemesPage = ({ slug, type }: ThemesPageProps) => {
  const router = useRouter();
  const { data, isLoading } = useAnimeTheme({ slug, type });
  const [isFetchingRandomTheme, setIsFetchingRandomTheme] = useState(false);

  const handleNewTheme = useCallback(async () => {
    setIsFetchingRandomTheme(true);

    const { slug, type } = await fetchRandomTheme();

    setIsFetchingRandomTheme(false);

    router.replace({
      pathname: router.pathname,
      query: {
        slug,
        type,
      },
    });
  }, [router]);

  const sources = useMemo(
    () =>
      isLoading || isFetchingRandomTheme || !data?.sources?.length
        ? blankVideo
        : data?.sources,
    [data?.sources, isFetchingRandomTheme, isLoading]
  );

  useEffect(() => {
    if (!data) return;

    router.replace(
      {
        pathname: router.pathname,
        query: {
          slug: data.slug,
          type: data.type,
        },
      },
      null
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (slug && type) return;

    handleNewTheme();
  }, [handleNewTheme, slug, type]);

  return (
    <React.Fragment>
      <Head
        title={
          !data ? `Themes - Kaguya` : `${data.name} (${data.type}) - Kaguya`
        }
        description="Immerse yourself in the world of anime music with our Anime Openings and Endings page. Here, you can watch and listen to your favorite anime songs, including opening and ending themes from popular anime shows. Our page features a vast collection of anime music, from the latest releases to classic favorites. You can easily search and sort by anime name, song title, and artist to find the perfect tune. Whether you're looking for an upbeat opening theme or a moving ending theme, our Anime Openings and Endings page has something for every anime fan. Visit us now and start enjoying the music of your favorite anime shows!"
      />

      <ThemePlayerContextProvider
        value={{
          theme: data,
          refresh: handleNewTheme,
          isLoading: isLoading || isFetchingRandomTheme,
        }}
      >
        <ThemeSettingsContextProvider>
          <ThemePlayer sources={sources} className="w-full h-screen" />
        </ThemeSettingsContextProvider>
      </ThemePlayerContextProvider>
    </React.Fragment>
  );
};

ThemesPage.getLayout = (children) => (
  <React.Fragment>{children}</React.Fragment>
);

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      slug: query.slug || null,
      type: query.type || null,
    },
  };
};

export default ThemesPage;
