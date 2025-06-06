import express from "express";
import axios from "axios";
import qs from "qs";

const router = express.Router();

router.get("/callback", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send("Missing `code` in query params.");
  }

  try {
    const result = await axios.post(
      "https://slack.com/api/oauth.v2.access",
      qs.stringify({
        code,
        client_id: process.env.SLACK_CLIENT_ID,
        client_secret: process.env.SLACK_CLIENT_SECRET,
        redirect_uri: "https://credit-analyst-slack.vercel.app/oauth/callback"
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      }
    );

    if (result.data.ok) {
      res.send("✅ Slack app installed successfully.");
    } else {
      res.status(400).send(`OAuth failed: ${result.data.error}`);
    }
  } catch (error) {
    console.error("OAuth error:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
