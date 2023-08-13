import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, errorMessage: "Method not allowed" });
  }

  const { data: sources, error: connectionError } = await supabaseClient
    .from("kaguya_sources")
    .select("languages, id, name")
    .contains("mediaType", ["MANGA"]);

  if (connectionError) {
    return res
      .status(500)
      .json({ success: false, errorMessage: connectionError.message });
  }

  res.status(200).json({
    success: true,
    sources,
  });
};

export default handler;
