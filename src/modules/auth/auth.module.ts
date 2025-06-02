import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { PasswordManagementController } from './controllers/password-management.controller';
import { JwtModule } from '../../shared/jwt/jwt.module';
import { BullModule } from '@nestjs/bull';
import { AuthProcessor } from './queues/auth.processor';
import { AuthService } from './services/auth.service';
@Module({
  providers: [AuthProcessor, AuthService],
  controllers: [AuthController, PasswordManagementController],
  imports: [
    BullModule.registerQueue({
      name: 'auth',
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: false,
        attempts: 5,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      },
    }),
    JwtModule,
  ],
})
export class AuthModule {}
