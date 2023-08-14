import config from "@/config";
import { createClient } from "@supabase/supabase-js";
import { NextApiRequest, NextApiResponse } from "next";
import { slugify } from "../file";

const supabaseAdminClient = createClient(
  config.supabaseUrl,
  process.env.SUPABASE_SERVICE_KEY
);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, errorMessage: "Method not allowed" });
  }

  const { name } = req.body;

  const { data: user, error } =
    await supabaseAdminClient.auth.api.getUserByCookie(req);

  if (!user || error) {
    return res
      .status(401)
      .json({ success: false, errorMessage: "Unauthorized" });
  }

  const { error: upsertError } = await supabaseAdminClient
    .from("kaguya_sources")
    .upsert({
      name: name,
      id: slugify(name),
      userId: user.id,
    });

  if (upsertError) {
    return res
      .status(500)
      .json({ success: false, errorMessage: upsertError.message });
  }

  res.status(200).json({ success: true });
};

export default handler;
