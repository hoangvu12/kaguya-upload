import config from "@/config";
import { User, createClient } from "@supabase/supabase-js";
import fsPromise from "fs/promises";
import os from "os";
import path from "path";
import WebTorrent from "webtorrent";
import DiscordUpload from "./discord";

const supabaseAdminClient = createClient(
  config.supabaseUrl,
  process.env.SUPABASE_SERVICE_KEY
);

export type TorrentQueue = {
  torrentUrl: string;
  id: string;
  user: User;
  percent: number;
  status: "failed" | "initial" | "downloading" | "downloaded";
  discordQueueId?: string;
  streamUrl?: string;
};

class TorrentUpload {
  currentQueue: TorrentQueue;
  queues: TorrentQueue[];
  totalQueues: TorrentQueue[];

  constructor() {
    this.currentQueue = null;
    this.queues = [];
    this.totalQueues = [];
  }

  async add(torrentUrl: string, user: any) {
    const id = generateId();

    const queue: TorrentQueue = {
      torrentUrl,
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

      const { torrentUrl, user } = this.currentQueue;

      this.currentQueue.status = "downloading";

      console.log(`Start downloading (queue: ${this.currentQueue.id})`);
      console.time(this.currentQueue.id);

      await this.syncQueueToDatabase();

      const dir = path.join(os.tmpdir(), "./kaguya-torrent");

      await fsPromise.rm(dir, { recursive: true, force: true });

      const client = new WebTorrent();

      const filePath = await new Promise((resolve, reject) => {
        client.on("error", (err) => {
          reject(err);
        });

        client.add(torrentUrl, { path: dir }, (torrent) => {
          const interval = setInterval(() => {
            // The downloading should only show 50% of the whole process.
            // Other 50% is the status of transcoding video and uploading to Discord
            const progress = ((torrent.progress * 100) / 2).toFixed(1);

            this.currentQueue.percent = parseInt(progress);
          }, 5000);

          torrent.on("done", () => {
            this.currentQueue.percent = 50;
            this.currentQueue.status = "downloaded";

            clearInterval(interval);

            const file = torrent.files[0];

            resolve(path.resolve(dir, file.name));
          });

          torrent.on("error", function (err) {
            reject(err);
          });
        });
      });

      if (!global.DiscordUpload) {
        global.DiscordUpload = DiscordUpload;
      }

      const discordQueueId = await global.DiscordUpload.add(filePath, user);

      this.currentQueue.discordQueueId = discordQueueId;

      await this.syncQueueToDatabase();

      console.log(`Start processing (queue: ${this.currentQueue.id})`);
      console.timeEnd(this.currentQueue.id);

      return null;
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
    let queue = this.totalQueues.find((queue) => queue.id === queueId);

    console.log(queue);

    if (!queue) {
      const { data: databaseQueue, error } = await supabaseAdminClient
        .from("kaguya_torrent_queue")
        .select("data")
        .eq("id", queueId)
        .single();

      if (error || !databaseQueue?.data) {
        console.error(error);

        return null;
      }

      queue = databaseQueue.data;
    }

    const { torrentUrl, user, discordQueueId, percent, ...rest } = queue;

    let torrentPercent = percent;

    if (torrentPercent >= 50) {
      if (!global.DiscordUpload) {
        global.DiscordUpload = DiscordUpload;
      }

      const discordQueue = await global.DiscordUpload.status(discordQueueId);

      if (!discordQueue) {
        return null;
      }

      const percent = ((discordQueue.percent || 0) / 2).toFixed(1);

      torrentPercent = 50 + parseInt(percent);

      rest.status = discordQueue.status;
      rest.streamUrl = discordQueue.streamUrl;
    }

    return { ...rest, percent: torrentPercent };
  }

  async syncQueueToDatabase() {
    const { torrentUrl, user, ...rest } = this.currentQueue;
    const { error } = await supabaseAdminClient
      .from("kaguya_torrent_queue")
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

export default new TorrentUpload();
