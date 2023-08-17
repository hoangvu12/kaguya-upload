import supabaseClient from "@/lib/supabase";
import { NextApiRequest, NextApiResponse } from "next";
import DiscordUpload from "@/utils/discord";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res
      .status(405)

      .json({ success: false, errorMessage: "Method not allowed" });
  }

  const headers = req.headers;

  if (!headers.authorization) {
    return res
      .status(401)
      .json({ success: false, errorMessage: "Unauthorized" });
  }

  const accessToken = headers.authorization.split(" ")[1];

  if (!accessToken) {
    return res
      .status(401)
      .json({ success: false, errorMessage: "Unauthorized" });
  }

  const { data: user, error } = await supabaseClient.auth.api.getUser(
    accessToken
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
    const { queueId } = req.query;

    if (!queueId) {
      return res
        .status(400)
        .json({ success: false, errorMessage: "Bad request" });
    }

    const queue = await global.DiscordUpload.status(
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
