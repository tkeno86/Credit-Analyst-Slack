import crypto from "crypto";

/**
 * Verifies that the request is genuinely from Slack.
 * @param {object} req - The Express request object.
 * @returns {boolean}
 */
export function verifySlackRequest(req) {
  const slackSignature = req.headers["x-slack-signature"];
  const timestamp = req.headers["x-slack-request-timestamp"];

  if (!slackSignature || !timestamp) return false;

  // Protect against replay attacks
  const fiveMinutesAgo = Math.floor(Date.now() / 1000) - (60 * 5);
  if (timestamp < fiveMinutesAgo) return false;

  const sigBaseString = `v0:${timestamp}:${JSON.stringify(req.body)}`;
  const mySignature = `v0=` + crypto
    .createHmac("sha256", process.env.SLACK_SIGNING_SECRET)
    .update(sigBaseString)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(mySignature, "utf8"),
    Buffer.from(slackSignature, "utf8")
  );
}
