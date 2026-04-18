const express = require("express");
const { google } = require("googleapis");

const router = express.Router();

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

// 1) Start Google auth
router.get("/auth/google", (req, res) => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
        return res.status(400).send("MISSING CREDENTIALS: Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env");
    }

    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: [
            "https://www.googleapis.com/auth/drive.file",
            "https://www.googleapis.com/auth/drive.metadata.readonly"
        ],
    });

    res.redirect(url);
});

// 2) Handle callback and log refresh token
router.get("/oauth2callback", async (req, res) => {
    try {
        const { code } = req.query;
        const { tokens } = await oauth2Client.getToken(code);

        console.log("\n--- GOOGLE TOKENS RECEIVED ---");
        if (tokens.refresh_token) {
            console.log("YOUR REFRESH TOKEN:", tokens.refresh_token);
            console.log("------------------------------\n");
        } else {
            console.log("No refresh token returned. Hint: You might already be authorized. Try clearing your permissions at myaccount.google.com/permissions");
        }

        res.send(`
      <div style="font-family: sans-serif; padding: 20px;">
        <h2 style="color: #4caf50;">Success!</h2>
        <p>Check your <b>Server Terminal</b> for the refresh token.</p>
        <p>Copy it into your .env as <code>GOOGLE_REFRESH_TOKEN</code></p>
      </div>
    `);
    } catch (err) {
        console.error("Error getting tokens:", err);
        res.status(500).send("Error getting tokens, check server logs.");
    }
});

module.exports = router;
