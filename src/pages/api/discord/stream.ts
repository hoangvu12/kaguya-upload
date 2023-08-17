import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res
      .status(405)

      .json({ success: false, errorMessage: "Method not allowed" });
  }

  const DiscordUpload = global.DiscordUpload;

  if (!DiscordUpload) {
    return res
      .status(500)
      .json({ success: false, errorMessage: "DiscordUpload not initialized" });
  }

  try {
    const { queueId } = req.query;

    if (!queueId) {
      return res
        .status(400)
        .json({ success: false, errorMessage: "Bad request" });
    }

    const queue = await DiscordUpload.status(
      typeof queueId === "string" ? queueId : queueId[0]
    );

    if (!queue) {
      return res
        .status(404)
        .json({ success: false, errorMessage: "Queue not found" });
    }

    res.status(200).json({
      success: true,
      url: queue?.streamUrl,
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
