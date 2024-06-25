const express = require('express');
const app = express();
require('dotenv').config();
const googleRoutes = require('./routes/googleAuth');
const outlookRoutes = require('./routes/outlookAuth');
const { fetchgoogleEmails } = require('./services/googleService');
const { fetchOutlookEmails } = require('./services/outlookService');
const logger = require('./logger/logger');
const cookieParser = require('cookie-parser');
const port = 3000;

app.use(cookieParser());
app.use(googleRoutes);
app.use(outlookRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
});


app.get('/fetch-google-emails', async (req, res) => {
    try {
        // Retrieve OAuth tokens from cookies or wherever they are stored
        const tokens = {
            access_token: req.cookies.access_token,
            refresh_token: req.cookies.refresh_token,
            expiry_date: req.cookies.token_expiry,
        };
        
        // Fetch emails using tokens
        const emails = await fetchgoogleEmails(tokens);
        
        // Respond with fetched emails
        logger.info("Fetched emails successfully");
        res.json(emails);
    } catch (error) {
        logger.error('Error fetching emails:', error);
        res.status(500).json({ error: 'Failed to fetch emails' });
    }
});

app.get('/fetch-outlook-emails', async (req, res) => {
    try {
        // Retrieve OAuth tokens from cookies or wherever they are stored
        const tokens = {
            access_token: req.cookies.access_token1, // Assuming Outlook uses access_token directly
        };
        
        // Fetch emails using tokens from Outloo
        const emails = await fetchOutlookEmails(tokens);
        
        // Respond with fetched emails
        logger.info("Fetched Outlook emails successfully");
        res.json(emails);
    } catch (error) {
        logger.error('Error fetching Outlook emails:', error);
        res.status(500).json({ error: 'Failed to fetch Outlook emails' });
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});