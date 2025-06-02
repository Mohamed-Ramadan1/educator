import { Injectable } from '@nestjs/common';
import { IAuthService } from '../interfaces/index';
@Injectable()
export class AuthService implements IAuthService {
  async registerUser(): Promise<void> {
    // Implementation for user registration
  }

  async loginUser(): Promise<void> {
    // Implementation for user login
    // return 'token'; // Placeholder return value
  }
}
