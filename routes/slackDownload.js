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

    const fileResponse = await axios.get(fileUrl, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "arraybuffer",
    });

    res.setHeader("Content-Type", fileInfo.data.file.mimetype);
    res.setHeader("Content-Disposition", `inline; filename="${fileInfo.data.file.name}"`);
    res.status(200).send(Buffer.from(fileResponse.data, "binary"));
  } catch (err) {
    console.error("Slack download error:", err);
    res.status(500).json({ error: "Failed to fetch file", details: err.message });
  }
}

