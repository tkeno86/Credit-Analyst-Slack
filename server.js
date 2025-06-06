import express from "express";
import dotenv from "dotenv";
import slackDownload from "./routes/slackDownload.js";
import slackParse from "./routes/slackParse.js"; // ✅ NEW: parse route

dotenv.config();

const app = express();

// ✅ Mount download route
app.use("/api/slack/files", slackDownload);

// ✅ Mount parse route
app.use("/api/slack/files/parse", slackParse); // ✅ NEW: parse route registered

// ✅ No need for app.listen() — Vercel handles it
export default app;

