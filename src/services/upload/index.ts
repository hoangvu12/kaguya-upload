import supabaseClient from "@/lib/supabase";
import { SupabaseChapter, SupabaseEpisode } from "@/types";
import { sendMessage } from "@/utils/events";
import axios from "axios";

export type FileInfo = {
  id?: string;
  size: number;
  name: string;
  converted: boolean;
  thumbnail?: string;
  error?: boolean;
};

export type Attachment = {
  id: string;
  filename: string;
  size: number;
  url: string;
  proxy_url: string;
  content_type: string;
  ctx?: Record<string, any>;
};

export type UploadVideoResponse = {
  success: boolean;
  videoId: string;
};

export type RemoteVideoUploadResponse = {
  success: boolean;
  remoteId: string | number;
};

export type RemoteStatus = {
  id?: string;
  progress?: number;
  fileId: string;
  downloaded: boolean;
  error: boolean;
};

export type RemoteStatusResponse = {
  success: boolean;
  remote: RemoteStatus;
};

export type UpsertEpisodeResponse = {
  success: boolean;
  episode: SupabaseEpisode;
};

export type UpsertChapterResponse = {
  success: boolean;
  chapter: SupabaseChapter;
};

export type UpsertEpisodeArgs = {
  sourceId: string;
  episode: {
    title: string;
    number: number;
    description?: string;
    thumbnail?: string;
    id: string;
  };
  mediaId: number;
};

export type UpsertChapterArgs = {
  sourceId: string;
  chapter: {
    title?: string;
    id: string;
    number: number;
  };
  mediaId: number;
};

export type UploadFileResponse = {
  success: boolean;
  files: Attachment[];
};

export const createUploadService = (hostingId: string) => {
  const session = supabaseClient.auth.session();

  const uploadVideo = async (file: File) => {
    const fileId = await sendMessage<
      {
        file: {
          url: string;
          name: string;
          mimeType: string;
        };
        hostingId: string;
        accessToken: string;
      },
      string
    >("file-upload", {
      file: {
        url: URL.createObjectURL(file),
        name: file.name,
        mimeType: file.type,
      },
      hostingId,
      accessToken: session?.access_token,
    });

    if (!fileId) {
      throw new Error("Upload video failed");
    }

    const videoInfo = await getVideoStatus(fileId);

    return videoInfo;
  };

  const getVideoStatus = async (videoId: string) => {
    const video = await sendMessage<
      { fileId: string; hostingId: string; accessToken: string },
      FileInfo
    >("file-status", {
      fileId: videoId,
      hostingId,
      accessToken: session?.access_token,
    });

    return video;
  };

  const getRemoteStatus = async (remoteId: string) => {
    const remoteStatus = await sendMessage<
      { remoteId: string; hostingId: string; accessToken: string },
      RemoteStatus
    >("remote-status", {
      remoteId,
      hostingId,
      accessToken: session?.access_token,
    });

    return remoteStatus;
  };

  const remoteUploadVideo = async (url: string) => {
    const remoteId = await sendMessage<
      { url: string; hostingId: string; accessToken: string },
      string
    >("remote-upload", {
      url,
      hostingId,
      accessToken: session?.access_token,
    });

    return remoteId;
  };

  return {
    getVideoStatus,
    getRemoteStatus,
    remoteUploadVideo,
    uploadVideo,
  };
};

export const upsertEpisode = async (args: UpsertEpisodeArgs) => {
  const { sourceId, episode, mediaId } = args;
  const { data } = await axios.post<UpsertEpisodeResponse>(`/api/episode`, {
    episode,
    sourceId,
    mediaId,
  });

  if (!data.success) throw new Error("Upsert episode failed");

  return data.episode;
};

export const upsertChapter = async (args: UpsertChapterArgs) => {
  const { sourceId, chapter, mediaId } = args;
  const { data } = await axios.post<UpsertChapterResponse>(`/api/chapter`, {
    chapter,
    sourceId,
    mediaId,
  });

  if (!data.success) throw new Error("Upsert chapter failed");

  return data.chapter;
};

export const uploadFile = async (
  file: File | File[],
  ctx?: object | object[]
) => {
  const formData = new FormData();

  if (Array.isArray(file)) {
    file.forEach((f) => formData.append("file", f));
  } else {
    formData.append("file", file);
  }

  if (ctx) {
    formData.append("ctx", JSON.stringify(ctx));
  }

  const { data } = await axios.post<UploadFileResponse>("/api/file", formData);

  if (!data.success) throw new Error("Upload failed");

  return data.files;
};
