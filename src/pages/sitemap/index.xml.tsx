import axios from "axios";
import { GetServerSideProps } from "next";
import React from "react";
import { parseStringPromise } from "xml2js";

const siteUrl = process.env.SITE_URL || "https://kaguya.app";

type Sitemap = {
  loc: string;
  lastmod: string;
};

function generateSiteMap(sitemaps: Sitemap[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${sitemaps
      .map(
        (sitemap) => `
        <sitemap>
            <loc>${sitemap.loc}</loc>
            <lastmod>${sitemap.lastmod}</lastmod>
        </sitemap>
    `
      )
      .join("")}
  </sitemapindex>
   `;
}

const SitemapIndexPage = () => {
  return <div>SitemapIndexPage</div>;
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  // We make an API call to gather the URLs for our site
  const { data } = await axios.get("https://anilist.co/sitemap/index.xml");

  const xml = await parseStringPromise(data);

  const sitemaps: Array<{ loc: string[]; lastmod: string[] }> =
    xml.sitemapindex.sitemap || [];

  const sitemapUrls = sitemaps.map((sitemap) => ({
    loc: sitemap.loc[0],
    lastmod: sitemap.lastmod[0],
  }));

  const blacklistedUrls = ["search", "articles"];

  const urls = sitemapUrls.filter(
    ({ loc }) =>
      !blacklistedUrls.some((blacklistedUrl) => loc.includes(blacklistedUrl))
  );

  const modifiedUrls = urls.map(({ loc, lastmod }) => ({
    loc: loc.replace("https://anilist.co", siteUrl),
    lastmod,
  }));

  const sitemap = generateSiteMap(modifiedUrls);

  res.setHeader("Content-Type", "text/xml");
  // we send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default SitemapIndexPage;
