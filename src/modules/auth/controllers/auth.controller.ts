import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor() {}
  @Post('login')
  @UsePipes()
  @UseGuards()
  @UseInterceptors()
  public login() {
    // Logic for user login

    return { message: 'User logged in successfully' };
  }
}
