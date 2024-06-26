require('dotenv').config();

const { Queue, Worker } = require('bullmq');
const { fetchGoogleEmails } = require('../services/googleService');
const { fetchOutlookEmails } = require('../services/outlookService');
const { processEmails } = require('../services/emailService');
const redisClient = require('./redisconn');
const logger = require('../logger/logger'); // Adjust path as needed

// Create and configure Redis client


// Create BullMQ queue with the Redis client
const emailQueue = new Queue('emailQueue', {
    connection: redisClient
});

// Worker to process email fetching tasks
const emailWorker = new Worker('emailQueue', async job => {
    const { provider, tokens } = job.data;

    let emails;
    if (provider === 'google') {
        emails = await fetchGoogleEmails(tokens);
    } else if (provider === 'outlook') {
        emails = await fetchOutlookEmails(tokens);
    }

    // Process emails
    await processEmails(emails);
}, {
    connection: redisClient
});

module.exports = { emailQueue };
