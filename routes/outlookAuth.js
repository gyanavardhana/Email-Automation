const msal = require('@azure/msal-node');
const router = require('express').Router();

const config = {
  auth: {
    clientId: process.env.OUTLOOK_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.TENANT_ID}`,
    clientSecret: process.env.OUTLOOK_CLIENT_SECRET,
  },
};

const pca = new msal.ConfidentialClientApplication(config);

const redirectUri = 'http://localhost:3000/outlook/callback';

router.get('/outlook', (req, res) => {
  const authCodeUrlParameters = {
    scopes: ["https://graph.microsoft.com/.default"],
    redirectUri,
    prompt: "select_account", // Add prompt parameter to force account selection
  };
  pca.getAuthCodeUrl(authCodeUrlParameters).then((response) => {
    res.redirect(response);
  }).catch((error) => console.log(JSON.stringify(error)));
});

router.get('/outlook/callback', (req, res) => {
  const tokenRequest = {
    code: req.query.code,
    scopes: ["https://graph.microsoft.com/.default"],
    redirectUri,
  };
  pca.acquireTokenByCode(tokenRequest).then((response) => {
    // Store tokens in the session or database
    console.log(response);
    res.send('Outlook OAuth successful');
  }).catch((error) => console.log(JSON.stringify(error)));
});

module.exports = router;
