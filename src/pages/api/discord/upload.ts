import supabaseClient from "@/lib/supabase";
import DiscordUpload from "@/utils/discord";
import uploader from "huge-uploader-nodejs";
import { NextApiRequest, NextApiResponse } from "next";
import os from "os";

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
    responseLimit: false,
  },
};

const MAX_FILE_SIZE = 4000; // 4gb
const MAX_CHUNK_FILE = 10; // 10mb

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, errorMessage: "Method not allowed" });
  }

  const { data: user, error } = await supabaseClient.auth.api.getUserByCookie(
    req
  );

  if (error || !user) {
    return res
      .status(401)
      .json({ success: false, errorMessage: "Unauthorized" });
  }

  if (!global.DiscordUpload) {
    global.DiscordUpload = DiscordUpload;
  }

  try {
    const assembleChunks = await uploader(
      req,
      os.tmpdir(),
      MAX_FILE_SIZE,
      MAX_CHUNK_FILE
    );

    // on last chunk, assembleChunks function is returned
    // the response is already sent to the browser because it can take some time if the file is huge
    if (assembleChunks) {
      try {
        const data = await assembleChunks();

        const queueId = await global.DiscordUpload.add(data.filePath, user);

        res.status(200).json({ success: true, queueId });
      } catch (err) {
        console.log(err);
      }
    } else {
      // chunk written to disk
      res.writeHead(204, "No Content");
      res.end();
    }
  } catch (err) {
    if (err.message === "Missing header(s)") {
      return res.status(400).json({
        success: false,
        errorMessage: "Missing header(s)",
      });
    }

    if (err.message === "Missing Content-Type") {
      return res.status(400).json({
        success: false,
        errorMessage: "Missing Content-Type",
      });
    }

    if (err.message.includes("Unsupported content type")) {
      res.status(400).json({ error: "Unsupported content type" });
      return;
    }

    if (err.message === "Chunk is out of range") {
      res.status(400).json({
        success: true,
        errorMessage:
          "Chunk number must be between 0 and total chunks - 1 (0 indexed)",
      });
      return;
    }

    if (err.message === "File is above size limit") {
      res.status(413).json({
        success: true,
        errorMessage: `File is too large. Max fileSize is: ${MAX_FILE_SIZE}MB`,
      });
      return;
    }

    if (err.message === "Chunk is above size limit") {
      res.status(413).json({
        success: true,
        errorMessage: `Chunk is too large. Max chunkSize is: ${MAX_CHUNK_FILE}MB`,
      });
      return;
    }

    if (err && err.message === "Upload has expired") {
      res
        .status(410)
        .json({ success: true, errorMessage: "Upload has expired" });
      return;
    }

    res.status(500).json({ success: true, errorMessage: err.message });
  }
};

export default handler;
