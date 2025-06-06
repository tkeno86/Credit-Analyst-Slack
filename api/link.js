import axios from "axios";

export default async function handler(req, res) {
  const fileId = req.query.id;
  const token = process.env.SLACK_BOT_TOKEN;

  if (!fileId) {
    return res.status(400).json({ error: "Missing file ID" });
  }

  try {
    const fileInfo = await axios.get("https://slack.com/api/files.info", {
      params: { file: fileId },
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!fileInfo.data.ok) {
      return res.status(404).json({ error: "Slack file not found" });
    }

    const fileUrl = fileInfo.data.file.url_private;

    res.status(200).json({ url: fileUrl });
  } catch (err) {
    console.error("Slack file link error:", err.message);
    res.status(500).json({
      error: "Failed to get Slack file link",
      details: err.message,
    });
  }
}
