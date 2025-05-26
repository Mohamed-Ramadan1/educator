import { Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor() {}
  @Post('login')
  public login() {
    // Logic for user login

    return { message: 'User logged in successfully' };
  }
}
