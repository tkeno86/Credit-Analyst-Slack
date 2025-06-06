import axios from "axios";
import pdfParse from "pdf-parse";

export default async function handler(req, res) {
  const fileId = req.query.id;
  const token = process.env.SLACK_BOT_TOKEN;

  if (!fileId) {
    return res.status(400).json({ error: "Missing file ID" });
  }

  try {
    // Step 1: Get file metadata
    const fileInfo = await axios.get("https://slack.com/api/files.info", {
      params: { file: fileId },
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!fileInfo.data.ok) {
      return res.status(404).json({ error: "Slack file not found" });
    }

    // Step 2: Get actual PDF file
    const fileUrl = fileInfo.data.file.url_private;

    const fileResponse = await axios.get(fileUrl, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "arraybuffer",
    });

    // Step 3: Parse PDF content
    const parsed = await pdfParse(fileResponse.data);

    res.status(200).json({ text: parsed.text });
  } catch (err) {
    console.error("slackParse.js error:", err.message);
    res.status(500).json({
      error: "Failed to parse PDF from Slack",
      details: err.message,
    });
  }
}

