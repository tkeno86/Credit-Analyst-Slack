import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.get("/download", async (req, res) => {
  const fileId = req.query.id;
  const token = process.env.SLACK_BOT_TOKEN;

  if (!fileId) {
    return res.status(400).json({ error: "Missing file ID" });
  }

  try {
    // Step 1: Get file info
    const fileInfo = await axios.get("https://slack.com/api/files.info", {
      params: { file: fileId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!fileInfo.data.ok) {
      return res.status(404).json({ error: "Slack file not found" });
    }

    const url = fileInfo.data.file.url_private;

    // Step 2: Stream the file back to GPT
    const fileStream = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "stream",
    });

    res.setHeader("Content-Type", "application/pdf");
    fileStream.data.pipe(res);
  } catch (err) {
    console.error("Slack file download error:", err.message);
    res.status(500).json({ error: "Failed to download file" });
  }
});

export default router;

