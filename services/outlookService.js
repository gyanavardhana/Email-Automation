const { Client } = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');
const logger = require('../logger/logger');

async function fetchOutlookEmails(token) {
  const client = Client.init({
    authProvider: (done) => {
      done(null, token.access_token);
    },
  });

  try {
    const res = await client.api('/me').get();
    console.log(res);
    return res.value;
  } catch (error) {
    logger.error('Error fetching Outlook emails:', error);
    res.status(500).json({ error: 'Failed to fetch Outlook emails' });
  }
}

module.exports = { fetchOutlookEmails };
