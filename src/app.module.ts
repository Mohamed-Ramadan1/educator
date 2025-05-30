import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { databaseConfig } from '@config/index';
import { LoggerModule } from '@shared/logger/logger.module';
@Module({
  imports: [
    LoggerModule,
    TypeOrmModule.forRoot(databaseConfig),
    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
