import { Module, Global } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from '../config';
import { LoggingService } from './services/logging.service';

@Global() // Makes LoggingService available everywhere
@Module({
  imports: [WinstonModule.forRoot(winstonConfig)],
  providers: [LoggingService],
  exports: [LoggingService],
})
export class LoggingModule {}
