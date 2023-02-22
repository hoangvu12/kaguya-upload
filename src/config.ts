const config = {
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  nodeServer: {
    global: process.env.NEXT_PUBLIC_NODE_SERVER_URL,
    vn: process.env.NEXT_PUBLIC_NODE_VN_SERVER_URL,
  },
  proxyServer: {
    global: process.env.NEXT_PUBLIC_PROXY_SERVER_URL,
    vn: process.env.NEXT_PUBLIC_PROXY_VN_SERVER_URL,
    edge: process.env.NEXT_PUBLIC_PROXY_EDGE_SERVER_URL,
  },
  socketServerUrl: process.env.NEXT_PUBLIC_SOCKET_SERVER_URL,
  webPushPublicKey: process.env.NEXT_PUBLIC_WEB_PUSH,
  discordWebhookLoggerUrl: process.env.DISCORD_WEBHOOK_LOGGER,
};

export default config;
