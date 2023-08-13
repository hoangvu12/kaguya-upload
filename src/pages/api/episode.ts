import config from "@/config";
import supabaseClient from "@/lib/supabase";
import { SourceConnection, SupabaseEpisode } from "@/types";
import { createClient } from "@supabase/supabase-js";
import type { NextApiRequest, NextApiResponse } from "next";

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

  const { user, error } = await supabaseClient.auth.api.getUserByCookie(req);

  if (error || !user) {
    return res
      .status(401)
      .json({ success: false, errorMessage: "Unauthorized" });
  }

  const {
    episode: { title, id, thumbnail, description, number },
    sourceId,
    mediaId,
  } = req.body;

  const sourceMediaId = `${sourceId}-${mediaId}`;

  const connection = mergeAnimeConnection({
    mediaId: Number(mediaId),
    sourceId,
    sourceMediaId,
  });

  const episodeConnection = mergeAnimeEpisode({
    title: title as string,
    sourceId: sourceId as string,
    sourceMediaId,
    sourceEpisodeId: id as string,
    thumbnail,
    description,
    number,
    section: "",
  });

  const { error: connectionError } = await supabaseAdminClient
    .from("kaguya_anime_source")
    .upsert(connection, { returning: "minimal" });

  if (connectionError) {
    return res
      .status(500)
      .json({ success: false, errorMessage: connectionError.message });
  }

  const { data: insertedEpisode, error: episodeError } =
    await supabaseAdminClient
      .from("kaguya_episodes")
      .upsert({ ...episodeConnection, userId: user.id, published: false })
      .single();

  if (episodeError) {
    return res
      .status(500)
      .json({ success: false, errorMessage: episodeError.message });
  }

  res.status(200).json({
    success: true,
    episode: insertedEpisode,
  });
};

const mergeAnimeEpisode = ({
  title,
  sourceMediaId,
  sourceId,
  sourceEpisodeId,
  section,
  thumbnail,
  description,
  number,
}: Partial<SupabaseEpisode>) => ({
  title,
  sourceConnectionId: `${sourceMediaId}-${sourceId}`,
  sourceMediaId,
  sourceEpisodeId,
  sourceId,
  slug: `${sourceId}-${sourceEpisodeId}`,
  section,
  thumbnail,
  description,
  number,
});

const mergeAnimeConnection = ({
  mediaId,
  sourceId,
  sourceMediaId,
}: SourceConnection) => ({
  id: `${sourceMediaId}-${sourceId}`,
  mediaId,
  sourceMediaId,
  sourceId,
});

export default handler;
