import express from "express";

import slackDownload from "./routes/slackDownload.js";
import slackParse from "./routes/slackParse.js";
import slackLink from "./routes/slackLink.js"; // ✅ Make sure this file exists

const app = express();

app.get("/", (req, res) => {
  res.send("Slack Credit Analyst backend is running.");
});

app.use("/api/slack/files", slackDownload);
app.use("/api/slack/files/parse", slackParse);
app.use("/api/slack/files/link", slackLink); // ✅ Now serves link endpoint

export default app;

