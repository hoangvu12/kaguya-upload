import supabaseClient from "@/lib/supabase";
import DiscordUpload from "@/utils/discord";
import { Fields, File, IncomingForm } from "formidable";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
    responseLimit: false,
  },
};

const parseFiles = (
  req: NextApiRequest
): Promise<{ files: File[]; body: Fields }> => {
  const form = new IncomingForm({
    maxFileSize: 4 * 1024 * 1024 * 1024,
  });

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
    const { files } = await parseFiles(req);

    const file = files[0];

    const queueId = await global.DiscordUpload.add(file, user);

    res.status(200).json({
      success: true,
      queueId,
    });
  } catch (err) {
    console.log("Discord upload", err);

    res.status(500).json({
      success: false,
      errorMessage: err.message,
    });
  }
};

export default handler;
