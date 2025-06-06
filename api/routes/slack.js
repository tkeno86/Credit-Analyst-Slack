import express from "express";
import { verifySlackRequest } from "../slack/utils.js";

const router = express.Router();

router.post("/events", express.json(), (req, res) => {
  // 🔒 Validate Slack signature
  if (!verifySlackRequest(req)) {
    return res.status(401).send("Unauthorized");
  }

  const { type, event, challenge } = req.body;

  // ✅ Handle URL verification (needed for Slack to confirm your endpoint)
  if (type === "url_verification") {
    return res.send({ challenge });
  }

  // ✅ Handle app mentions
  if (type === "event_callback" && event.type === "app_mention") {
    console.log("App mentioned:", event.text);
    // You can send a reply using Slack Web API with your access token
  }

  res.sendStatus(200);
});

export default router;
