const { google } = require('googleapis');
const router = require('express').Router();
const logger = require('../logger/logger');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:3000/google/callback'  // Redirect URL
);

const scopes = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send'
];

router.get('/google', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });
  res.redirect(url);
});

router.get('/google/callback', async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  res.cookie('access_token', tokens.access_token, { httpOnly: true });
  res.cookie('refresh_token', tokens.refresh_token, { httpOnly: true });
  res.cookie('token_expiry', tokens.expiry_date, { httpOnly: true });
  logger.info('Google OAuth successful');
  res.send('Google OAuth successful');
});

router.get('/check-auth', (req, res) => {
  const { access_token, refresh_token, token_expiry } = req.cookies;
  
  if (access_token && refresh_token && token_expiry) {
    // Tokens exist in cookies
    oauth2Client.setCredentials({
      access_token,
      refresh_token,
      expiry_date: parseInt(token_expiry),
    });
    logger.info("User is authenticated");
    res.send('You are authenticated');
  } else {
    logger.warn("User is not authenticated")
    res.redirect('/google');
  }
});

router.get('/google/logout', (req, res) => {
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');
  res.clearCookie('token_expiry');
  logger.info("User logged out")
  res.redirect('/');
});


module.exports = router;
