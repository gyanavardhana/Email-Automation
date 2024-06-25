const msal = require('@azure/msal-node');
const logger = require('../logger/logger');
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
  }).catch((error) => {
    logger.error('Error generating auth code URL:', error);
    res.status(500).send('Error generating auth code URL');
  });
});

router.get('/outlook/callback', async (req, res) => {
  const tokenRequest = {
    code: req.query.code,
    scopes: ["https://graph.microsoft.com/.default"],
    redirectUri,
  };
  try {
    const response = await pca.acquireTokenByCode(tokenRequest);
    // Store tokens in cookies
    console.log(response)
    res.cookie('access_token1', response.accessToken, { httpOnly: true });
    res.cookie('refresh_token1', response.refreshToken, { httpOnly: true });
    res.cookie('token_expiry1', response.expiresOn.getTime().toString(), { httpOnly: true });
    logger.info('Outlook OAuth successful');
    res.send('Outlook OAuth successful');
  } catch (error) {
    logger.error('Error acquiring token by code:', error);
    res.status(500).send('Error acquiring token by code');
  }
});

router.get('/check-auth', (req, res) => {
  const { access_token, refresh_token, token_expiry } = req.cookies;
  
  if (access_token && refresh_token && token_expiry) {
    // Tokens exist in cookies
    logger.info("User is authenticated");
    res.send('You are authenticated');
  } else {
    logger.warn("User is not authenticated");
    res.redirect('/outlook');
  }
});

router.get('/outlook/logout', (req, res) => {
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');
  res.clearCookie('token_expiry');
  logger.info("User logged out");
  res.redirect('/');
});

module.exports = router;
