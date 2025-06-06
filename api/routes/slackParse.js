import axios from "axios";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.js";

export default async function handler(req, res) {
  const fileId = req.query.id;
  const token = process.env.SLACK_BOT_TOKEN;

  if (!fileId) {
    return res.status(400).json({ error: "Missing Slack file ID" });
  }

  try {
    // Step 1: Get Slack file info
    const fileInfoRes = await axios.get("https://slack.com/api/files.info", {
      params: { file: fileId },
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!fileInfoRes.data.ok || !fileInfoRes.data.file) {
      return res.status(404).json({ error: "File not found or access denied." });
    }

    const fileUrl = fileInfoRes.data.file.url_private;

    // Step 2: Download the file from Slack
    const fileRes = await axios.get(fileUrl, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "arraybuffer"
    });

    // Step 3: Use pdfjs to parse the buffer
    const loadingTask = pdfjsLib.getDocument({ data: fileRes.data });
    const pdf = await loadingTask.promise;

    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map((item) => item.str);
      text += strings.join(" ") + "\n";
    }

    res.status(200).json({ text: text.trim() });
  } catch (error) {
    console.error("Slack PDF parsing failed:", error.message);
    res.status(500).json({
      error: "PDF parsing error",
      details: error.message
    });
  }
}
