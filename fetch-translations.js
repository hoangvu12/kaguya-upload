const { default: axios } = require("axios");
const fs = require("fs");
const AdmZip = require("adm-zip");
const rimraf = require("rimraf");

require("dotenv").config({ path: "./.env.local" });

// https://translate.kaguya.app/v2/projects/export?ak=<Only new key can be revealed>

const API_KEY = process.env.TOLGEE_API_KEY;

(async () => {
  if (!API_KEY) {
    throw new Error("Env variable `TOLGEE_API_KEY` is required");
  }

  const { data } = await axios.get(
    `https://translate.kaguya.app/v2/projects/export?ak=${API_KEY}`,
    {
      responseType: "stream",
    }
  );

  const writeStream = fs.createWriteStream("./public/tolgee.zip");
  data.pipe(writeStream);

  writeStream.on("finish", () => {
    const zip = new AdmZip("./public/tolgee.zip");
    zip.extractAllTo("./public/locales", true);

    console.log("Unzip completed");

    fs.unlinkSync("./public/tolgee.zip");
  });
})();
