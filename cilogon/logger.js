// logger.js
const pino = require('pino');
const pinoHttp = require('pino-http');
require('dotenv').config();

// Get current timestamp for the logging structure
const currentTime = new Date();
const yearUTC = String(currentTime.getUTCFullYear()).padStart(4, '0');
const monthUTC = String(currentTime.getUTCMonth() + 1).padStart(2, '0');
const dayUTC = String(currentTime.getUTCDate()).padStart(2, '0');

const logger = pino({
  level: process.env.LOGGER_LOG_LEVEL || "info",
  timestamp: () => `,"time":"${new Date().toISOString()}"`,
  transport: {
    targets: [
      // Channel the log to a destination file
      {
        target: 'pino/file',
        options: {
          // Structure: logs/yyyy/mm/auth-{yyyy-mm-dd}.log
          destination: `/app/logs/${yearUTC}/${monthUTC}/auth-${yearUTC}-${monthUTC}-${dayUTC}.log`,
          mkdir: true
        }
      },
      // Prettify the log for STDOUT
      {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: 'UTC:yyyy-mm-dd HH:MM:ss.l o'
        }
      }
    ]
  },
  // Redact sensitive information and PII
  redact: ["user.email", "user.given_name"],
});

// Handling uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.fatal({ err }, 'Uncaught Exception occurred!');
  // Exit the process after logging the error
  process.exit(1);
});

// Handling unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.fatal({ reason, promise }, 'Unhandled Rejection occurred!');
  // Exit the process after logging the error
  process.exit(1);
});

const httpLogger = pinoHttp({ logger });

module.exports = {
  logger,
  httpLogger
}