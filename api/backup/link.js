import axios from "axios";

export default async function handler(req, res) {
  const rawId = req.query.id;
  const token = process.env.SLACK_BOT_TOKEN;

  if (!rawId) {
    return res.status(400).json({ error: "Missing file ID" });
  }

  try {
    let fileId = rawId;

    // Convert ChatGPT-style file ID (file-XXXX) to Slack file ID
    if (rawId.startsWith("file-")) {
      const fileList = await axios.get("https://slack.com/api/files.list", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!fileList.data.ok || !fileList.data.files) {
        return res.status(404).json({ error: "Slack file list not found" });
      }

      const match = fileList.data.files.find(f =>
        f.name?.includes(rawId.replace("file-", ""))
      );

      if (!match) {
        return res.status(404).json({ error: "Matching Slack file not found" });
      }

      fileId = match.id;
    }

    // Retrieve file info using Slack file ID
    const fileInfo = await axios.get("https://slack.com/api/files.info", {
      params: { file: fileId },
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!fileInfo.data.ok) {
      return res.status(404).json({ error: "Slack file not found" });
    }

    const fileUrl = fileInfo.data.file.url_private;
    res.status(200).json({ link: fileUrl });
  } catch (err) {
    console.error("Slack file link error:", err.message);
    res.status(500).json({
      error: "Failed to retrieve Slack file link",
      details: err.message,
    });
  }
}
