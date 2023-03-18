import axios from "axios";
import { GetServerSideProps } from "next";
import React from "react";
import { parseStringPromise } from "xml2js";

const siteUrl = process.env.SITE_URL || "https://kaguya.app";

type Pagemap = {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
};

function generateSiteMap(pagemaps: Pagemap[]) {
  return `
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
    ${pagemaps.map(
      (pagemap) => `
        <url>
            <loc>${pagemap.loc}</loc>
            <lastmod>${pagemap.lastmod}</lastmod>
            <changefreq>${pagemap.changefreq}</changefreq>
            <priority>${pagemap.priority}</priority>
        </url>
    `
    )}
  </urlset>
   `;
}

const replaceWithList = (
  string: string,
  replaceList: { from: string; to: string }[]
) => {
  let newString = string;

  for (const replaceItem of replaceList) {
    newString = newString.replace(replaceItem.from, replaceItem.to);
  }

  return newString;
};

const SitemapPartPage = () => {
  return <div>SitemapIndexPage</div>;
};

export const getServerSideProps: GetServerSideProps = async ({
  res,
  params,
}) => {
  const { part } = params;

  // We make an API call to gather the URLs for our site
  const { data } = await axios.get(`https://anilist.co/sitemap/${part}`);

  const xml = await parseStringPromise(data);

  const pagemaps: Array<{
    loc: string[];
    lastmod: string[];
    changefreq: string[];
    priority: string[];
  }> = xml.urlset.url || [];

  const pagemapUrls = pagemaps.map((sitemap) => ({
    loc: sitemap.loc[0],
    lastmod: sitemap.lastmod[0],
    priority: sitemap.priority[0],
    changefreq: sitemap.changefreq[0],
  }));

  const replaceList = [
    {
      from: "anime",
      to: "anime/details",
    },
    {
      from: "manga",
      to: "manga/details",
    },
    {
      from: "character",
      to: "characters/details",
    },
    {
      from: "staff",
      to: "voice-actors/details",
    },
  ];

  const modifiedUrls = pagemapUrls.map(({ loc, ...rest }) => ({
    loc: replaceWithList(
      loc.replace("https://anilist.co", siteUrl),
      replaceList
    ).toLowerCase(),
    ...rest,
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

export default SitemapPartPage;
