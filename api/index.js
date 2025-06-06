import express from "express";
import serverless from "serverless-http"; // ✅ Required for Vercel to handle Express properly

import slackDownload from "./routes/slackDownload.js";
import slackParse from "./routes/slackParse.js";
import slackLink from "./routes/link.js";

const app = express();

app.get("/", (req, res) => {
  res.send("Slack Credit Analyst backend is running.");
});

app.use("/api/slack/files", slackDownload);
app.use("/api/slack/files/parse", slackParse);
app.use("/api/slack/files/link", slackLink);

// ✅ Export handler instead of app
export const handler = serverless(app);
export default app;
