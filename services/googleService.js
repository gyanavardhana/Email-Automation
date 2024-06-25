const { google } = require('googleapis');
const logger = require('../logger/logger');
async function fetchgoogleEmails(tokens) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'http://localhost:3000/google/callback'  // Redirect URL
  );
  
  oauth2Client.setCredentials(tokens);
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  
  try {
    const res = await gmail.users.messages.list({ userId: 'me' });
    return res.data.messages;
  } catch (error) {
    logger.error('Error fetching emails:', error);
    return res.status(500).send('Error fetching emails');
  }
}

module.exports = { fetchgoogleEmails };
