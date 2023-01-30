import { NextApiRequest, NextApiResponse } from "next";
import config from "@/config";
import axios from "axios";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({
        error: "Method Not Allowed",
        message: `Method ${req.method} Not Allowed`,
        success: false,
      });
    }

    if (!config.discordWebhookLoggerUrl) {
      return res.status(500).json({
        error: "Internal Server Error",
        message: "Discord Webhook Logger URL is not set",
        success: false,
      });
    }

    const referer = req.headers.referer;

    const { error, stack, componentStack, errorSource } = req.body;

    const fields = [];

    if (stack) {
      fields.push({
        name: "Stack",
        value: stack,
      });
    }

    if (componentStack) {
      fields.push({
        name: "Component Stack",
        value: componentStack,
      });
    }

    if (errorSource) {
      fields.push({
        name: "Error Source",
        value: errorSource,
      });
    }

    if (referer) {
      fields.push({
        name: "Referer",
        value: referer,
      });
    }

    const embeds = [
      {
        title: error,
        color: 14177041,
        fields: fields,
        timestamp: new Date().toISOString(),
      },
    ];

    await axios.post(
      config.discordWebhookLoggerUrl,
      { embeds },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    res.status(200).json({
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
      success: false,
    });
  }
};

export default handler;
