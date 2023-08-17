import { DiscordAttachment, DiscordFile, uploadFile } from "@/utils/discord";
import { Fields, File, IncomingForm } from "formidable";
import { NextApiRequest, NextApiResponse } from "next";

const DISCORD_MAX_FILE_SIZE = 25 * 1024 * 1024;
const MAXIMUM_ATTACHMENTS_PER_MESSAGE = 10;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const chunk = <T>(array: T[], size: number) =>
  Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
    array.slice(i * size, i * size + size)
  );

export const slugify = (...args: (string | number)[]): string => {
  const value = args.join(" ");

  return value
    .normalize("NFD") // split an accented letter in the base letter and the acent
    .replace(/[\u0300-\u036f]/g, "") // remove all previously split accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 ]/g, "") // remove all chars not letters, numbers and spaces (to be replaced)
    .replace(/\s+/g, "-"); // separator
};

export const config = {
  api: {
    bodyParser: false,
  },
};

const parseFiles = (
  req: NextApiRequest
): Promise<{ files: File[]; body: Fields }> => {
  const form = new IncomingForm();

  return new Promise((resolve, reject) => {
    const finalFiles: File[] = [];

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.log(err);

        reject(err);
      } else {
        for (const fileField in files) {
          const file = files[fileField];

          const isArray = Array.isArray(file);

          if (isArray) {
            finalFiles.push(...file);
          } else {
            finalFiles.push(file);
          }
        }

        resolve({ files: finalFiles, body: fields });
      }
    });
  });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, errorMessage: "Method not allowed" });
  }

  try {
    const { files, body } = await parseFiles(req);
    const { ctx } = body;

    const chunkedFiles: File[][] = [];

    let uploadCount = 0;

    const modifiedNameFiles = files.map((file, index) => {
      const extension = file.originalFilename.split(".").pop();
      const name = file.originalFilename.replace(`.${extension}`, "");

      file.originalFilename = slugify(name) + `_${index + 1}.${extension}`;

      return file;
    });

    const sortedSizeFiles = [...modifiedNameFiles].sort(
      (a, b) => a.size - b.size
    );

    sortedSizeFiles.forEach((file) => {
      const latestIndex = !chunkedFiles.length ? 0 : chunkedFiles.length - 1;

      if (!chunkedFiles[latestIndex]) {
        chunkedFiles.push([file]);

        return;
      }

      const totalFileSize =
        chunkedFiles[latestIndex]?.reduce((acc, cur) => acc + cur.size, 0) || 0;

      if (totalFileSize + file.size < DISCORD_MAX_FILE_SIZE) {
        chunkedFiles[latestIndex].push(file);
      } else {
        chunkedFiles.push([file]);
      }
    });

    const chunkUploadedFiles: DiscordAttachment[][] = [];

    for (const chunkFile of chunkedFiles) {
      const amountChunks = chunk(chunkFile, MAXIMUM_ATTACHMENTS_PER_MESSAGE);

      for (const chunk of amountChunks) {
        const files: DiscordFile[] = chunk.map((file) => ({
          name: file.originalFilename,
          path: file.filepath,
        }));

        const uploadedFiles = await uploadFile(files);

        uploadCount++;

        await sleep(uploadCount * 1000);

        chunkUploadedFiles.push(uploadedFiles);
      }
    }

    const uploadedFiles = chunkUploadedFiles.flat();

    if (!uploadedFiles?.length) {
      return res
        .status(500)
        .json({ success: false, errorMessage: "Upload failed" });
    }

    let modifiedFiles: DiscordAttachment[] = files.map((file) =>
      uploadedFiles.find(
        (uploadedFile) =>
          uploadedFile.filename === file.originalFilename.replace(/ /g, "_")
      )
    );

    if (ctx) {
      const parsedCtx = JSON.parse(ctx as string);

      if (Array.isArray(parsedCtx)) {
        modifiedFiles = modifiedFiles.map((file, index) => ({
          ...file,
          ctx: parsedCtx[index],
        }));
      } else {
        modifiedFiles = modifiedFiles.map((file) => ({
          ...file,
          ctx: parsedCtx,
        }));
      }
    }

    res.status(200).json({ success: true, files: modifiedFiles });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      errorMessage: err.message,
    });
  }
};

export default handler;
