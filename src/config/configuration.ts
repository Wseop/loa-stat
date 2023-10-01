export default () => ({
  app: {
    env: process.env.NODE_ENV,
    port: parseInt(process.env.PORT),
  },
  db: {
    uri: process.env.MONGODB_URI,
    dbName: process.env.MONGODB_NAME,
  },
  googleSheet: {
    sheetId: process.env.SHEET_ID,
    clientEmail: process.env.CLIENT_EMAIL,
    privateKey: process.env.PRIVATE_KEY,
  },
  discord: {
    token: process.env.BOT_TOKEN,
    guildId: process.env.GUILD_ID,
    noticeUrl: process.env.NOTICE_HOOK_URL,
  },
});
