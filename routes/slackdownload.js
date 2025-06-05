import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/download", async (req, res) => {
  const fileId = req.query.id;

  if (!fileId) {
    return res.status(400).send("Missing file ID");
  }

  try {
    const info = await axios.get("https://slack.com/api/files.info", {
      params: { file: fileId },
      headers: {
        Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`
      }
    });

    const fileUrl = info.data?.file?.url_private;

    if (!fileUrl) return res.status(404).send("File not found");

    const file = await axios.get(fileUrl, {
      headers: {
        Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`
      },
      responseType: "arraybuffer"
    });

    res.set("Content-Type", "application/pdf");
    res.send(file.data);
  } catch (err) {
    console.error("File download error:", err.message);
    res.status(500).send("Failed to fetch file from Slack.");
  }
});

export default router;
