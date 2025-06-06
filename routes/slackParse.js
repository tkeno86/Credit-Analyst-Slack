import axios from "axios";
import pdfParse from "pdf-parse";

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

    const parsed = await pdfParse(fileResponse.data);
    const cleanedText = parsed.text?.trim() || "";

    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ text: cleanedText });
  } catch (err) {
    console.error("Slack PDF parse error:", err.message);
    res.status(500).json({
      error: "Failed to parse Slack file",
      details: err.message,
    });
  }
}

