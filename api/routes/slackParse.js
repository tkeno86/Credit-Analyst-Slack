import axios from "axios";
import { getDocument } from "pdfjs-dist";
import { Readable } from "stream";

export default async function handler(req, res) {
  const fileId = req.query.id;
  const token = process.env.SLACK_BOT_TOKEN;

  if (!fileId) {
    return res.status(400).json({ error: "Missing file ID" });
  }

  try {
    // 1. Get Slack file info
    const fileInfo = await axios.get("https://slack.com/api/files.info", {
      params: { file: fileId },
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!fileInfo.data.ok) {
      return res.status(404).json({ error: "Slack file not found" });
    }

    const fileUrl = fileInfo.data.file.url_private;

    // 2. Download PDF as array buffer
    const fileResponse = await axios.get(fileUrl, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "arraybuffer",
    });

    // 3. Convert buffer to Uint8Array for PDF.js
    const pdfData = new Uint8Array(fileResponse.data);

    const loadingTask = getDocument({ data: pdfData });
    const pdf = await loadingTask.promise;

    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map(item => item.str).join(" ");
      fullText += pageText + "\n";
    }

    res.status(200).json({ text: fullText.trim() });
  } catch (err) {
    console.error("Slack PDF parse error:", err.message);
    res.status(500).json({
      error: "Failed to parse Slack file",
      details: err.message,
    });
  }
}
