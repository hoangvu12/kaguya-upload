import supabaseClient from "@/lib/supabase";
import TorrentUpload from "@/utils/torrent";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
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

  if (!global.TorrentUpload) {
    global.TorrentUpload = TorrentUpload;
  }

  try {
    const { queueId } = req.query;

    if (!queueId) {
      return res
        .status(400)
        .json({ success: false, errorMessage: "Bad request" });
    }

    const queue = await global.TorrentUpload.status(
      typeof queueId === "string" ? queueId : queueId[0]
    );

    if (!queue) {
      return res
        .status(404)
        .json({ success: false, errorMessage: "Queue not found" });
    }

    res.status(200).json({
      success: true,
      queue,
    });
  } catch (err) {
    console.log("Discord status", err);

    res.status(500).json({
      success: false,
      errorMessage: err.message,
    });
  }
};

export default handler;
