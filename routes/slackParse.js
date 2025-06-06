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

    res.status(200).json({ text: parsed.text });
  } catch (err) {
    console.error("Slack parse error:", err);
    res.status(500).json({
      error: "Failed to extract PDF text from Slack",
      details: err.message,
    });
  }
}