import express from "express";
import dotenv from "dotenv";
import slackDownload from "./routes/slackDownload.js"; // ✅ adjust path if needed

dotenv.config();
const app = express();

app.use("/api/slack/files", slackDownload); // ✅ this registers your route

export default app;
