import axios from "axios";
import FormData from "form-data";
import { File } from "formidable";
import fs from "fs";

const WEBHOOK_URLS = [
  "https://discord.com/api/webhooks/1140219537103527987/Ctnm61JX0AKeH5pzud-qpZcdG0vevgVHK-h2EzEXgQvvpeUks1oov51lswxDx9s-btxy",
];

export type DiscordAttachment = {
  id: string;
  filename: string;
  size: number;
  url: string;
  proxy_url: string;
  content_type: string;
  ctx: Record<string, any>;
};

export const uploadFile = async (file: File | File[]) => {
  let urlCounter = 0;

  const formData = new FormData();

  if (Array.isArray(file)) {
    file.forEach((file, index) => {
      const data = fs.readFileSync(file.filepath);

      formData.append(`files[${index}]`, data, file.originalFilename);
    });
  } else {
    const data = fs.readFileSync(file.filepath);

    formData.append("file", data, file.originalFilename);
  }

  const send = async () => {
    try {
      const { data } = await axios.post<{ attachments: DiscordAttachment[] }>(
        WEBHOOK_URLS[urlCounter],
        formData,
        {
          headers: { ...formData.getHeaders() },
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
      if (urlCounter < WEBHOOK_URLS.length - 1) {
        urlCounter++;

        return send();
      } else {
        throw new Error("Upload failed");
      }
    }
  };

  return send();
};
