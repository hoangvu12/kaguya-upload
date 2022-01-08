import supabase from "@/lib/supabaseAdmin";
import { Anime } from "@/types";
import type { NextApiRequest, NextApiResponse } from "next";

const edit = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "PATCH") {
    res.status(400).json({ success: false });

    return;
  }

  const { id } = req.query;

  const { user, error: userError } = await supabase.auth.api.getUserByCookie(
    req
  );

  if (!user || userError) {
    return res.status(401).json({ success: false, error: userError.message });
  }

  const { data: syncUser, error: syncUserError } = await supabase
    .from("users")
    .select("auth_role")
    .eq("id", user.id)
    .limit(1)
    .single();

  if (syncUserError) {
    return res
      .status(401)
      .json({ success: false, error: syncUserError.message });
  }

  if (syncUser.auth_role !== "admin") {
    return res
      .status(401)
      .json({ success: false, error: syncUserError.message });
  }

  const { error } = await supabase
    .from<Anime>("anime")
    .update(req.body, { returning: "minimal" })
    .match({ ani_id: Number(id) });

  if (error) {
    res.status(400).json({ success: false, error: error.message });

    return;
  }

  res.json({ success: true });
};

export default edit;
