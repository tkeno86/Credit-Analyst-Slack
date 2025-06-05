import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";

import slackRoutes from "./routes/slack.js";
import oauthRoutes from "./routes/oauth.js";

dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/slack", slackRoutes);
app.use("/oauth", oauthRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`⚡ Server running on port ${PORT}`));
