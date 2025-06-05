import express from "express";
import dotenv from "dotenv";
import slackDownload from "./routes/slackDownload.js"; // ✅ adjust path if needed

dotenv.config();

const app = express();

// ✅ Mount your Slack file download route
app.use("/api/slack/files", slackDownload);

// ✅ IMPORTANT: Do NOT call app.listen() — Vercel handles it
export default app;

