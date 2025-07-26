import { Module, Global } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QueueService } from './queue.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { QueueCleanupService } from './queue-cleanup.service';

@Global()
@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST', 'localhost'),
          port: configService.get('REDIS_PORT', 6379),
          password: configService.get('REDIS_PASSWORD'),
          db: configService.get('REDIS_DB', 0),
          retryDelayOnFailover: 100,
          maxRetriesPerRequest: 3,
          connectTimeout: 10000,
          lazyConnect: true,
        },
        prefix: configService.get('QUEUE_PREFIX', 'bull'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [QueueService, QueueCleanupService],
  exports: [QueueService, QueueCleanupService],
})
export class QueueModule {}
