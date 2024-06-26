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
        const res = await gmail.users.messages.list({ userId: 'me', maxResults: 10 }); // Adjust maxResults as needed
        const messages = res.data.messages || [];

        // Fetch detailed information for each message
        const emails = await Promise.all(messages.map(async (message) => {
            const msg = await gmail.users.messages.get({
                userId: 'me',
                id: message.id,
            });

            const headers = msg.data.payload.headers;
            const subjectHeader = headers.find(header => header.name === 'Subject');
            const fromHeader = headers.find(header => header.name === 'From');
            const toHeader = headers.find(header => header.name === 'To');
            
            const subject = subjectHeader ? subjectHeader.value : '(no subject)';
            const from = fromHeader ? extractEmail(fromHeader.value) : '(unknown sender)';
            const to = toHeader ? extractEmail(toHeader.value) : '(unknown receiver)';

            return {
                id: msg.data.id,
                threadId: msg.data.threadId,
                snippet: msg.data.snippet,
                subject: subject,
                from: from,
                to: to,
                // Include other parts of the email as needed
            };
        }));

        return emails;
    } catch (error) {
        logger.error('Error fetching emails:', error);
        throw new Error('Error fetching emails');
    }
}

function extractEmail(headerValue) {
    const emailRegex = /<([^>]+)>/;
    const match = headerValue.match(emailRegex);
    return match ? match[1] : headerValue;
}

module.exports = { fetchgoogleEmails };
