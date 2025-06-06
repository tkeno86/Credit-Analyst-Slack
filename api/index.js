import express from "express";
import slackDownload from "./routes/slackDownload.js";
import slackParse from "./routes/slackParse.js";
import slackLink from "./routes/link.js"; // ✅ Add this import

const app = express();

app.get("/", (req, res) => {
  res.send("Slack Credit Analyst backend is running.");
});

app.use("/api/slack/files", slackDownload);
app.use("/api/slack/files/parse", slackParse);
app.use("/api/slack/files/link", slackLink); // ✅ Register new route

export default app;

