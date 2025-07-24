import { WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import * as path from 'path';

// Create logs directory path
const logsDir = path.join(process.cwd(), 'src', 'logging', 'logs');

export const winstonConfig: WinstonModuleOptions = {
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),

  transports: [
    // Console output for development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, context }) => {
          const contextStr = typeof context === 'string' ? context : 'App';
          return `${String(timestamp)} [${contextStr}] ${String(level)}: ${String(message)}`;
        }),
      ),
    }),

    // Daily rotating file for all logs
    new DailyRotateFile({
      filename: path.join(logsDir, 'application', 'app-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d', // Keep logs for 14 days
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),

    // Daily rotating file for errors only
    new DailyRotateFile({
      filename: path.join(logsDir, 'errors', 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d', // Keep error logs longer
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),

    // Daily rotating file for metrics (for Prometheus/Grafana)
    new DailyRotateFile({
      filename: path.join(logsDir, 'metrics', 'metrics-%DATE%.log'),
      datePattern: 'YYYY-MM-DD-HH', // Hourly rotation for metrics
      zippedArchive: true,
      maxSize: '50m',
      maxFiles: '7d',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        // Filter to only log entries marked as metrics
        winston.format((info) => {
          return info.metric ? info : false;
        })(),
      ),
    }),

    // Daily rotating file for audit logs
    new DailyRotateFile({
      filename: path.join(logsDir, 'audit', 'audit-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '10m',
      maxFiles: '365d', // Keep audit logs for 1 year
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        // Filter to only log entries marked as audit
        winston.format((info) => {
          return info.audit ? info : false;
        })(),
      ),
    }),
  ],
};
