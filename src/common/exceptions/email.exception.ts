import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class EmailValidationError extends BaseException {
  constructor(message: string, path?: string) {
    super(`Email validation failed: ${message}`, HttpStatus.BAD_REQUEST, path);
  }
}

export class EmailSendError extends BaseException {
  public readonly originalError?: any;

  constructor(message: string, originalError?: any, path?: string) {
    super(
      `Email sending failed: ${message}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
      path,
    );
    this.originalError = originalError;
  }
}

export class EmailConfigurationError extends BaseException {
  constructor(message: string, path?: string) {
    super(
      `Email configuration error: ${message}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
      path,
    );
  }
}

export class EmailConnectionError extends BaseException {
  constructor(message: string, path?: string) {
    super(
      `Email connection error: ${message}`,
      HttpStatus.SERVICE_UNAVAILABLE,
      path,
    );
  }
}
