import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { PasswordManagementController } from './controllers/password-management.controller';
import { JwtModule } from '../../shared/jwt/jwt.module';
@Module({
  controllers: [AuthController, PasswordManagementController],
  imports: [JwtModule],
})
export class AuthModule {}
