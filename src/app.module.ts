import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { EmailsModule } from './modules/emails/emails.module';
import { QueueModule } from './queue/queue.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { LoggingModule } from './logging/logging.module';
import { MonitoringModule } from './monitoring/monitoring.module';
import { HealthModule } from './health/health.module';
import { StorageModule } from './storage/storage.module';
import { CacheModule } from './cache/cache.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      autoLoadEntities: true,
    }),
    AuthModule,
    UsersModule,
    EmailsModule,
    QueueModule,
    NotificationsModule,
    LoggingModule,
    MonitoringModule,
    HealthModule,
    StorageModule,
    CacheModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
