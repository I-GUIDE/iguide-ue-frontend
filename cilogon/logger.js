// logger.js
const pino = require('pino');
const pinoHttp = require('pino-http');
require('dotenv').config();
const { WebClient } = require('@slack/web-api');

// Make sure that the slack token has chat.write scope enabled
const slackToken = process.env.SLACK_API_TOKEN;
const slackChannelId = process.env.SLACK_CHANNEL_ID;
const slackClient = new WebClient(slackToken);

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

async function sendSlackFatalErrorAlert(text) {
  if (!slackToken || !slackChannelId) {
    logger.warn('Slack token or channel not configured.');
    return;
  }

  try {
    await slackClient.chat.postMessage({
      channel: slackChannelId,
      text: text,
    });
  } catch (err) {
    logger.error('Failed to send Slack message', err);
  }
}


// Handle fatal error through logging and a graceful exit
async function handleFatalError(error, type) {
  try {
    logger.fatal(error, `${type} occurred!`);

    const message = `*Authentication backend fatal error: ${type}*\n\`\`\`${error.stack || error.message || error}\`\`\``;
    await sendSlackFatalErrorAlert(message);
  } catch (err) {
    console.error(`Failed during fatal error handling:`, err);
  } finally {
    // Wait to ensure logs are flushed before exiting
    setTimeout(() => {
      process.exit(1);
    }, 1000);
  }
}

// Handling uncaught exceptions
process.on('uncaughtException', (err) => {
  handleFatalError(err, 'Uncaught Exception');
});

// Handling unhandled promise rejections
process.on('unhandledRejection', (reason) => {
  const error = reason instanceof Error ? reason : new Error(String(reason));
  handleFatalError(error, 'Unhandled Promise Rejection');
});

const httpLogger = pinoHttp({ logger });

module.exports = {
  logger,
  httpLogger
}