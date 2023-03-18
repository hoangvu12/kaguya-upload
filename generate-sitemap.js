const { default: axios } = require("axios");
const { parseStringPromise } = require("xml2js");
const siteUrl = process.env.SITE_URL || "https://kaguya.app";
const fs = require("fs/promises");

const SITEMAP_SIZE = 3000;

const replaceWithList = (string, replaceList) => {
  let newString = string;

  for (const replaceItem of replaceList) {
    newString = newString.replace(replaceItem.from, replaceItem.to);
  }

  return newString;
};

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

const getIndex = async () => {
  const { data } = await axios.get("https://anilist.co/sitemap/index.xml");

  const xml = await parseStringPromise(data);

  const sitemaps = xml.sitemapindex.sitemap || [];

  const sitemapUrls = sitemaps.map((sitemap) => ({
    loc: sitemap.loc[0],
    lastmod: sitemap.lastmod[0],
  }));

  const allowedUrls = ["anime", "manga"];

  const urls = sitemapUrls.filter(({ loc }) =>
    allowedUrls.some((blacklistedUrl) => loc.includes(blacklistedUrl))
  );

  const parts = urls.map(({ loc }) =>
    loc.replace("https://anilist.co/sitemap/", "")
  );

  console.log(parts);

  return parts;
};

const getPart = async (part) => {
  const { data } = await axios.get(`https://anilist.co/sitemap/${part}`);

  const xml = await parseStringPromise(data);

  const pagemaps = xml.urlset.url || [];

  const pagemapUrls = pagemaps.map((sitemap) => ({
    loc: sitemap.loc[0],
    lastmod: sitemap.lastmod[0],
    priority: sitemap.priority[0],
    changefreq: sitemap.changefreq[0],
  }));

  const modifiedUrls = pagemapUrls.map(({ loc, ...rest }) => ({
    loc: replaceWithList(
      loc.replace("https://anilist.co", siteUrl),
      replaceList
    ).toLowerCase(),
    ...rest,
  }));

  return modifiedUrls;
};

function generateSiteMap(pagemaps) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pagemaps
  .map(
    (pagemap) => `<url>
<loc>${pagemap.loc}</loc>
<lastmod>${pagemap.lastmod}</lastmod>
<changefreq>${pagemap.changefreq}</changefreq>
<priority>${pagemap.priority}</priority>
</url>
`
  )
  .join("")}
</urlset>
`;
}

function generateSiteMapIndex(sitemaps) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps
  .map(
    (sitemap) => `<sitemap>
<loc>${sitemap.loc}</loc>
<lastmod>${sitemap.lastmod}</lastmod>
</sitemap>
`
  )
  .join("")}
</sitemapindex>
`;
}

const chunk = (arr, chunkSize) => {
  const array = [];

  for (let i = 0; i < arr.length; i += chunkSize)
    array.push(arr.slice(i, i + chunkSize));

  return array;
};

const getPaths = async () => {
  const result = [];

  const parts = await getIndex();

  if (!parts?.length) return [];

  for (const part of parts) {
    const partInfo = await getPart(part);

    console.log(part, partInfo.length);

    if (!partInfo?.length) continue;

    result.push(...partInfo);
  }

  console.log(result.length);

  return result;
};

const run = async () => {
  const paths = await getPaths();

  const pathChunks = chunk(paths, SITEMAP_SIZE || 10000);

  for (const [index, chunk] of pathChunks.entries()) {
    fs.writeFile(`./public/sitemap-${index}.xml`, generateSiteMap(chunk));
  }

  fs.writeFile(
    "./public/sitemap.xml",
    generateSiteMapIndex(
      pathChunks.map((_, index) => ({
        loc: `${siteUrl}/sitemap-${index}.xml`,
        lastmod: new Date().toISOString(),
      }))
    )
  );
};

run();
