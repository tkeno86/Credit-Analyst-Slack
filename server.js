import express from "express";
import slackDownload from "./routes/slackDownload.js";
import slackParse from "./routes/slackParse.js";
import slackLink from "./routes/link.js"; // ✅ import the new link route

const app = express();

app.get("/", (req, res) => {
  res.send("Slack Credit Analyst backend is running.");
});

// ✅ mount routes
app.use("/api/slack/files", slackDownload);
app.use("/api/slack/files/parse", slackParse);
app.use("/api/slack/files/link", slackLink); // ✅ add the /link endpoint

export default app;
