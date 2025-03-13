// logger.js
const pino = require('pino');
const pinoHttp = require('pino-http');

const logger = pino({
  level: process.env.LOGGER_LOG_LEVEL || "info",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: 'UTC:yyyy-mm-dd HH:MM:ss.l o'
    }
  },
  redact: ["user.email", "user.given_name"],
}, pino.destination("./auth-server.log"));

const httpLogger = pinoHttp({ logger });

module.exports = {
  logger,
  httpLogger
}