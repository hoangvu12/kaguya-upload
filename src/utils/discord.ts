import config from "@/config";
import { path as ffmpegPath } from "@ffmpeg-installer/ffmpeg";
import { User, createClient } from "@supabase/supabase-js";
import axios from "axios";
import Ffmpeg from "fluent-ffmpeg";
import FormData from "form-data";
import fs from "fs";
import fsPromise from "fs/promises";
import os from "os";
import path from "path";
import { sleep } from ".";

Ffmpeg.setFfmpegPath(ffmpegPath);

const DISCORD_MAX_FILE_SIZE = 25 * 1024 * 1024;
const MAXIMUM_ATTACHMENTS = 10;

const WEBHOOK_URL =
  "https://discord.com/api/webhooks/1141471651729514646/HOrL9aXjr6n-1CHZNC_ou-j1e8OxLFM57YXEkkBLt38N23iTOtQg2yQQ7xpa0wtC6GYc";

const supabaseAdminClient = createClient(
  config.supabaseUrl,
  process.env.SUPABASE_SERVICE_KEY
);

export type DiscordAttachment = {
  id: string;
  filename: string;
  size: number;
  url: string;
  proxy_url: string;
  content_type: string;
  ctx: Record<string, any>;
};

export type DiscordFile = {
  name: string;
  path: string;
  size?: number;
};

export type DiscordQueue = {
  filePath: string;
  id: string;
  user: User;
  percent: number;
  status: "completed" | "processing" | "failed" | "initial";
  streamUrl: string;
};

export const uploadFile = async (
  file: DiscordFile | DiscordFile[]
): Promise<DiscordAttachment[]> => {
  const MAX_RETRY = 1;
  let retry = 0;

  const formData = new FormData();

  if (Array.isArray(file)) {
    file.forEach((file, index) => {
      const data = fs.readFileSync(file.path);

      formData.append(`files[${index}]`, data, file.name);
    });
  } else {
    const data = fs.readFileSync(file.path);

    formData.append("file", data, file.name);
  }

  const send = async () => {
    try {
      const { data } = await axios.post<{ attachments: DiscordAttachment[] }>(
        WEBHOOK_URL,
        formData,
        {
          headers: { ...formData.getHeaders() },
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
        }
      );

      if (!data?.attachments?.length) throw new Error("No attachments found");

      const attachments = (data.attachments as DiscordAttachment[]).map(
        (attachment) => ({
          ...attachment,
          url: attachment.url,
          proxy_url: attachment.proxy_url,
        })
      );

      return attachments;
    } catch (e) {
      console.error("Upload discord", e.message);

      await sleep(5000);

      if (retry < MAX_RETRY) {
        retry += 1;

        return send();
      } else {
        throw new Error("Upload failed");
      }
    }
  };

  return send();
};

const chunk = <T>(array: T[], size: number) =>
  Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
    array.slice(i * size, i * size + size)
  );

class DiscordUpload {
  currentQueue: DiscordQueue;
  queues: DiscordQueue[];
  totalQueues: DiscordQueue[];

  constructor() {
    this.currentQueue = null;
    this.queues = [];
    this.totalQueues = [];
  }

  async add(filePath, user: any) {
    const id = generateId();

    const queue: DiscordQueue = {
      filePath,
      user,
      id,
      status: "initial",
      percent: 0,
      streamUrl: "",
    } as const;

    this.queues.push(queue);
    this.totalQueues.push(queue);

    if (!this.currentQueue) {
      this.handleQueueCycle();
    }

    await this.syncQueueToDatabase();

    return id;
  }

  handleQueueCycle() {
    if (this.currentQueue) return;

    if (this.queues.length >= 1) {
      this.currentQueue = this.queues.shift();

      this.handleQueue();
    }
  }

  async handleQueue() {
    if (!this.currentQueue) {
      return;
    }

    try {
      if (!this.currentQueue) return;

      const { filePath } = this.currentQueue;

      this.currentQueue.status = "processing";

      console.log(`Start processing (queue: ${this.currentQueue.id})`);
      console.time(this.currentQueue.id);

      await this.syncQueueToDatabase();

      const dir = path.resolve(os.tmpdir(), "./kaguya");

      if (await isDirExist(dir)) {
        await fsPromise.rm(dir, { recursive: true, force: true });
      }

      await fsPromise.mkdir(dir);

      await new Promise((resolve, reject) => {
        Ffmpeg(filePath)
          .outputOptions([
            "-codec: copy",
            "-start_number 0",
            "-hls_time 10",
            "-hls_list_size 0",
            "-f hls",
            `-hls_segment_filename ${dir}/%05d.html`,
            "-sn",
          ])
          .output(path.join(dir, "./output.m3u8"))
          .on("end", () => {
            console.log("File converted successfully");

            this.currentQueue.percent = 50;

            resolve(null);
          })
          .on("error", (err) => {
            console.error("Error converting file:", err);

            reject(err);
          })
          .on("progress", (progress) => {
            this.currentQueue.percent =
              progress.percent >= 50 ? 50 : progress.percent || 0;

            console.log("Processing: " + (progress.percent || 0) + "% done");
          })
          .run();
      });

      // read file from dir
      const dirFiles = await fsPromise.readdir(dir);

      if (!dirFiles) {
        throw new Error("Failed to convert file to HLS");
      }

      const segmentFileNames = dirFiles.filter((file) =>
        file.endsWith(".html")
      );

      const segmentFiles: DiscordFile[] = await Promise.all(
        segmentFileNames.map(async (file) => {
          const filePath = path.join(dir, file);

          // get file size
          const fileSize = await fsPromise
            .stat(filePath)
            .then((stat) => stat.size);

          return {
            name: file,
            path: filePath,
            size: fileSize,
          };
        })
      );

      const sortedSegmentFiles = [...segmentFiles].sort(
        (a, b) => a.size - b.size
      );

      const segmentChunks: DiscordFile[][] = [];

      sortedSegmentFiles.forEach((file) => {
        const latestIndex = !segmentChunks.length
          ? 0
          : segmentChunks.length - 1;

        if (!segmentChunks[latestIndex]) {
          segmentChunks.push([file]);

          return;
        }

        const totalFileSize =
          segmentChunks[latestIndex]?.reduce((acc, cur) => acc + cur.size, 0) ||
          0;

        const latestSegment = segmentChunks[latestIndex];

        if (
          totalFileSize + file.size < DISCORD_MAX_FILE_SIZE &&
          latestSegment.length < MAXIMUM_ATTACHMENTS
        ) {
          latestSegment.push(file);
        } else {
          segmentChunks.push([file]);
        }
      });

      const segmentAttachments: DiscordAttachment[] = [];

      const TOTAL_FILES = segmentFiles.length;
      let uploadedFileCount = 0;

      const promiseSegmentChunks = chunk(segmentChunks, 1);

      for (const segmentChunks of promiseSegmentChunks) {
        const segmentPromises = segmentChunks.map(async (chunk) => {
          const attachments = await uploadFile(chunk);

          uploadedFileCount += attachments.length;

          segmentAttachments.push(...attachments);

          this.currentQueue.percent =
            50 + Math.floor(((uploadedFileCount / TOTAL_FILES) * 100) / 2);

          return attachments;
        });

        await Promise.all(segmentPromises);
      }

      if (!segmentAttachments) {
        return new Error("Error uploading segments");
      }

      const originalContent = await fsPromise.readFile(
        path.join(dir, "output.m3u8"),
        "utf-8"
      );

      let content = originalContent;

      for (const attachment of segmentAttachments) {
        content = content.replaceAll(attachment.filename, attachment.url);
      }

      await fsPromise.writeFile(path.join(dir, "output.m3u8"), content);

      const masterAttachment = await uploadFile([
        {
          name: "output.m3u8",
          path: path.join(dir, "output.m3u8"),
        },
      ]);

      if (!masterAttachment?.[0]?.url) {
        new Error("Error uploading master");
      }

      this.currentQueue.status = "completed";
      this.currentQueue.streamUrl = masterAttachment[0].url;
      this.currentQueue.percent = 100;

      await this.syncQueueToDatabase();

      console.log(`Start processing (queue: ${this.currentQueue.id})`);
      console.timeEnd(this.currentQueue.id);

      return masterAttachment;
    } catch (err) {
      this.currentQueue.status = "failed";
      this.currentQueue.percent = 0;

      await this.syncQueueToDatabase();

      throw err;
    } finally {
      this.currentQueue = null;

      this.handleQueueCycle();
    }
  }

  async status(queueId: string) {
    const queue = this.totalQueues.find((queue) => queue.id === queueId);

    if (!queue) {
      const { data: databaseQueue, error } = await supabaseAdminClient
        .from("kaguya_discord_queue")
        .select("data")
        .eq("id", queueId)
        .single();

      if (error || !databaseQueue?.data) {
        console.error(error);

        return null;
      }

      return databaseQueue.data;
    }

    const { filePath, user, ...rest } = queue;

    return rest;
  }

  async syncQueueToDatabase() {
    const { filePath, user, ...rest } = this.currentQueue;
    const { error } = await supabaseAdminClient
      .from("kaguya_discord_queue")
      .upsert(
        {
          id: rest.id,
          data: rest,
          userId: user.id,
        },
        { returning: "minimal" }
      );
    if (error) {
      console.error(error);
    }
  }
}

// Random id
const generateId = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

function isDirExist(file: string) {
  return fs.promises
    .access(file, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false);
}

export default new DiscordUpload();
