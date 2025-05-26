import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { PasswordManagementController } from './controllers/password-management.controller';

@Module({
  controllers: [AuthController, PasswordManagementController],
})
export class AuthModule {}
