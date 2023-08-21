import supabaseClient from "@/lib/supabase";
import TorrentUpload from "@/utils/torrent";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: true,
    externalResolver: true,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, errorMessage: "Method not allowed" });
  }

  const { url } = req.body;

  if (!url) {
    return res
      .status(400)
      .json({ success: false, errorMessage: "Bad request" });
  }

  const { data: user, error } = await supabaseClient.auth.api.getUserByCookie(
    req
  );

  if (error || !user) {
    return res
      .status(401)
      .json({ success: false, errorMessage: "Unauthorized" });
  }

  if (!global.TorrentUpload) {
    global.TorrentUpload = TorrentUpload;
  }

  try {
    const torrentQueueId = await global.TorrentUpload.add(url, user);

    res.status(200).json({ success: true, queueId: torrentQueueId });
  } catch (err) {
    console.log(err);

    res.status(500).json({ success: true, errorMessage: err.message });
  }
};

export default handler;
