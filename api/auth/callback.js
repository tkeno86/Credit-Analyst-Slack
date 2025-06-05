// pages/api/auth/callback.js

import fetch from 'node-fetch';

export default async function handler(req, res) {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send('Missing code parameter.');
  }

  const client_id = process.env.SLACK_CLIENT_ID;
  const client_secret = process.env.SLACK_CLIENT_SECRET;
  const redirect_uri = 'https://credit-analyst-slack.vercel.app/api/auth/callback';

  const params = new URLSearchParams({
    code,
    client_id,
    client_secret,
    redirect_uri,
  });

  try {
    const response = await fetch('https://slack.com/api/oauth.v2.access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    const data = await response.json();

    if (!data.ok) {
      console.error('Slack OAuth error:', data);
      return res.status(500).json({ error: 'OAuth failed', details: data });
    }

    // For development only: show token in response
    return res.status(200).json({
      message: 'OAuth Success!',
      access_token: data.access_token,
      team: data.team.name,
    });

    // 🔐 TODO: In production, securely store the token (e.g., cookie or database)

  } catch (error) {
    console.error('OAuth exchange error:', error);
    return res.status(500).json({ error: 'OAuth token exchange failed', details: error.message });
  }
}
