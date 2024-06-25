const { Client } = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');

async function fetchEmails(token) {
  const client = Client.init({
    authProvider: (done) => {
      done(null, token.accessToken);
    },
  });

  const res = await client.api('/me/messages').get();
  return res.value;
}

module.exports = { fetchEmails };
