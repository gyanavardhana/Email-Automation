const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:3000/google/callback'
);

async function fetchEmails(token) {
  oauth2Client.setCredentials(token);
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  const res = await gmail.users.messages.list({ userId: 'me' });
  return res.data.messages;
}

module.exports = { fetchEmails };
