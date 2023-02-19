import React from "react";
import NextHead from "next/head";
import { WEBSITE_URL } from "@/constants";
import { useRouter } from "next/router";
import config from "@/config";

interface HeadProps {
  title?: string;
  description?: string;
  image?: string;
}

const Head: React.FC<HeadProps> = (props) => {
  const {
    title = "Kaguya",
    description = "Welcome to Kaguya! Our website offers the latest and most popular anime series, with new episodes added regularly. You can watch your favorite anime shows online and on-demand, anytime, anywhere. Our extensive library features a vast selection of anime genres, including action, romance, comedy, and more. Explore our website and discover new anime series, get access to show synopses, and stay up-to-date with the latest news and release dates. Whether you're a long-time anime fan or a newcomer, our website is the perfect destination for all your anime needs. Visit us now and start watching!",
    image = "https://i.ibb.co/ckj3n48/image-2023-02-19-173520415.png",
  } = props;

  const { asPath, locale } = useRouter();

  const url = `${WEBSITE_URL}${locale === "en" ? "" : "/" + locale}${asPath}`;

  return (
    <NextHead>
      <title>{title}</title>
      <link rel="manifest" href="/manifest.json" />

      <link rel="preconnect" href={config.supabaseUrl} />
      <link rel="dns-prefetch" href={config.supabaseUrl} />

      <link rel="preconnect" href="https://fonts.googleapis.com/" />
      <link rel="dns-prefetch" href="https://fonts.googleapis.com/" />

      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />

      <meta name="title" content={title} />
      <meta name="description" content={description} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="application-name" content="Kaguya" />
      <meta name="apple-mobile-web-app-title" content="Kaguya" />
      <meta name="theme-color" content="#EF4444" />
      <meta name="msapplication-navbutton-color" content="#EF4444" />
      <meta
        name="apple-mobile-web-app-status-bar-style"
        content="black-translucent"
      />
      <meta name="msapplication-starturl" content="/" />

      <link rel="canonical" href={url} />

      {props.children}
    </NextHead>
  );
};

export default Head;
