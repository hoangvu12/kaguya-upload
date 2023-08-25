import supabaseClient from "@/lib/supabase";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, errorMessage: "Method not allowed" });
  }

  const { mediaId } = req.query;

  if (!mediaId) {
    return res
      .status(400)
      .json({ success: false, errorMessage: "Bad request" });
  }

  const { data, error } = await supabaseClient
    .from("kaguya_subtitles")
    .select(
      `
        file,
        language,
        fonts
      `
    )
    .eq("mediaId", mediaId);

  if (error) {
    console.log(error);

    return res
      .status(400)
      .json({ success: false, errorMessage: "Bad request" });
  }

  return res.status(200).json({ success: true, subtitles: data });
};

export default handler;
