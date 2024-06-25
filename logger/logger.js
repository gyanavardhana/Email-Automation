const devLogger = require('./devlogger')
const prodLogger = require('./prodlogger')
require('dotenv').config()

let logger = null;

if (process.env.NODE_ENV === "dev") {
    logger = devLogger()
}

if (process.env.NODE_ENV === "prod") {
    logger = prodLogger()
}

module.exports = logger;