// logger.js
const pino = require('pino');
const pinoHttp = require('pino-http');

const logger = pino({
  level: process.env.LOGGER_LOG_LEVEL || "info",
  transport: {
    target: "pino-pretty",
  },
});
const httpLogger = pinoHttp({ logger });

module.exports = {
  logger,
  httpLogger
}