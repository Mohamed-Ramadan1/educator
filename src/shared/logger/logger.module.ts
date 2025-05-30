import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({
          filename: 'combined.log',
          dirname: 'logs',
          level: 'info',
        }),
        new winston.transports.File({
          filename: 'error.log',
          dirname: 'logs',
          level: 'error',
        }),
      ],
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],
  providers: [],
  exports: [WinstonModule],
})
export class LoggerModule {}
