import { Injectable, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class LoggingService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  // Basic logging methods
  log(message: string, context?: string, metadata?: Record<string, any>) {
    this.logger.info(message, { context, ...metadata });
  }

  error(
    message: string,
    trace?: string,
    context?: string,
    metadata?: Record<string, any>,
  ) {
    this.logger.error(message, { trace, context, ...metadata });
  }

  warn(message: string, context?: string, metadata?: Record<string, any>) {
    this.logger.warn(message, { context, ...metadata });
  }

  debug(message: string, context?: string, metadata?: Record<string, any>) {
    this.logger.debug(message, { context, ...metadata });
  }

  // Metrics logging (for Prometheus/Grafana)
  logMetric(
    metricName: string,
    value: number,
    labels?: Record<string, string>,
    metadata?: Record<string, any>,
  ) {
    this.logger.info(`Metric: ${metricName}`, {
      metric: true,
      metricName,
      value,
      labels,
      timestamp: new Date().toISOString(),
      ...metadata,
    });
  }

  // Audit logging (for security/compliance)
  logAudit(action: string, userId?: string, metadata?: Record<string, any>) {
    this.logger.info(`Audit: ${action}`, {
      audit: true,
      action,
      userId,
      timestamp: new Date().toISOString(),
      ...metadata,
    });
  }

  // Performance logging
  logPerformance(
    operation: string,
    duration: number,
    context?: string,
    metadata?: Record<string, any>,
  ) {
    this.logger.info(`Performance: ${operation}`, {
      performance: true,
      operation,
      duration_ms: duration,
      context,
      timestamp: new Date().toISOString(),
      ...metadata,
    });
  }

  // Create child logger for specific modules
  createChildLogger(context: string) {
    return this.logger.child({ context });
  }
}
