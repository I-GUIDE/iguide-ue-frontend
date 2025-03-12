// logger.js
const pino = require('pino');
const pinoHttp = require('pino-http');

export const logger = pino({ level: process.env.LOGGER_LOG_LEVEL || "info" });
export const httpLogger = pinoHttp({ logger });