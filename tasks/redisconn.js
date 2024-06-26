require('dotenv').config();

const { createClient } = require('redis');
const logger = require('../logger/logger'); // Adjust path as needed

const client = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOSTNAME,
        port: process.env.REDIS_PORT,
    }
});


module.exports = client;
