import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class ValidationError extends BaseException {
  public readonly validationErrors: string[];

  constructor(errors: string[], path?: string) {
    const message = `Validation failed: ${errors.join(', ')}`;
    super(message, HttpStatus.BAD_REQUEST, path);
    this.validationErrors = errors;
  }
}

export class InvalidParameterError extends BaseException {
  constructor(parameter: string, value: any, path?: string) {
    super(
      `Invalid parameter '${parameter}' with value '${value}'`,
      HttpStatus.BAD_REQUEST,
      path,
    );
  }
}
