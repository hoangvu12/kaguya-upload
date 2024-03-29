import config from "@/config";
import supabaseClient from "@/lib/supabase";
import { SourceConnection, SupabaseChapter } from "@/types";
import { createClient } from "@supabase/supabase-js";
import type { NextApiRequest, NextApiResponse } from "next";

const supabaseAdminClient = createClient(
  config.supabaseUrl,
  process.env.SUPABASE_SERVICE_KEY
);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { mediaId, sourceId } = req.query;

    if (!mediaId || !sourceId) {
      return res
        .status(400)
        .json({ success: false, errorMessage: "Bad request" });
    }

    const { data, error } = await supabaseClient
      .from("kaguya_manga_source")
      .select(
        `
          chapters:kaguya_chapters(
              title,
              number,
              images:kaguya_images(
                data:images
              ),
              id:sourceChapterId
          )
        `
      )
      .eq("sourceId", sourceId)
      .eq("mediaId", mediaId)
      .eq("chapters.published", true)
      .single();

    if (error) {
      console.log(error);

      return res
        .status(400)
        .json({ success: false, errorMessage: "Bad request" });
    }

    if (!data?.chapters?.length) {
      return res.status(200).json({ success: true, chapters: [] });
    }

    const composedChapters = data.chapters.map((chapter) => {
      const images = chapter.images.flatMap((image) => {
        return image.data;
      });

      return {
        ...chapter,
        images,
      };
    });

    return res.status(200).json({ success: true, chapters: composedChapters });
  }

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
    chapter: { title, id, number },
    sourceId,
    mediaId,
  } = req.body;

  const sourceMediaId = `${sourceId}-${mediaId}`;

  const connection = mergeMangaConnection({
    mediaId: Number(mediaId),
    sourceId,
    sourceMediaId,
  });

  const chapterConnection = mergeMangaChapter({
    title: title as string,
    sourceId: sourceId as string,
    sourceMediaId,
    sourceChapterId: id as string,
    number,
    section: "",
  });

  const { error: connectionError } = await supabaseAdminClient
    .from("kaguya_manga_source")
    .upsert(connection, { returning: "minimal" });

  if (connectionError) {
    return res
      .status(500)
      .json({ success: false, errorMessage: connectionError.message });
  }

  const { data: insertedChapter, error: chapterError } =
    await supabaseAdminClient
      .from("kaguya_chapters")
      .upsert({ ...chapterConnection, userId: user.id, published: false })
      .single();

  if (chapterError) {
    return res
      .status(500)
      .json({ success: false, errorMessage: chapterError.message });
  }

  res.status(200).json({
    success: true,
    chapter: insertedChapter,
  });
};

export const mergeMangaChapter = ({
  title,
  sourceMediaId,
  sourceId,
  sourceChapterId,
  section,
  number,
}: Partial<SupabaseChapter>) => ({
  title,
  sourceConnectionId: `${sourceMediaId}-${sourceId}`,
  sourceMediaId,
  sourceChapterId,
  sourceId,
  slug: `${sourceId}-${sourceChapterId}`,
  section,
  number,
});

export const mergeMangaConnection = ({
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
