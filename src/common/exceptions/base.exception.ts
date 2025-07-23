import { HttpException, HttpStatus } from '@nestjs/common';

export abstract class BaseException extends HttpException {
  public readonly timestamp: Date;
  public readonly path?: string;

  constructor(
    message: string,
    statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    path?: string,
  ) {
    super(message, statusCode);
    this.timestamp = new Date();
    this.path = path;
    this.name = this.constructor.name;
  }
}
