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
    const fileInfo = await axios.get("https://slack.com/api/files.info", {
      params: { file: fileId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!fileInfo.data.ok) {
      return res.status(404).json({ error: "Slack file not found" });
    }

    const fileUrl = fileInfo.data.file.url_private;

    const fileResponse = await axios.get(fileUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "arraybuffer",
    });

    const base64Data = Buffer.from(fileResponse.data, "binary").toString("base64");

    res.json({
      filename: fileInfo.data.file.name,
      mimetype: fileInfo.data.file.mimetype,
      content_base64: base64Data,
    });
  } catch (err) {
    console.error("Slack file download error:", err.message);
    res.status(500).json({ error: "Failed to download file" });
  }
});

export default router;