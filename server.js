import express from "express";
import dotenv from "dotenv";
import slackDownload from "./routes/slackDownload.js";
import slackParse from "./routes/slackParse.js";

dotenv.config();

const app = express();

app.use("/api/slack/files", slackDownload);
app.use("/api/slack/files/parse", slackParse);

// ✅ Health check route for root
app.get("/", (req, res) => {
  res.send("Slack PDF Analyst backend is running.");
});

// ✅ Prevent favicon 500 errors
app.get("/favicon.ico", (req, res) => {
  res.status(204).end(); // No Content
});

export default app; // ✅ Needed for Vercel import in `index.js`

