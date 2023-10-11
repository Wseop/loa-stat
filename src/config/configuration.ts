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
    noticeURL: process.env.NOTICE_HOOK_URL,
  },
  auth: {
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
    redirectURL: process.env.REDIRECT_URL,
    accessSecret: process.env.ACCESS_SECRET,
    refreshSecret: process.env.REFRESH_SECRET,
  },
});
