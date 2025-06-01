import { Controller, Inject, Post, Req, Res } from '@nestjs/common';
import { IJwtService } from '../../../shared/jwt/interfaces/jwt-service.interface';
import { IJWT_SERVICE } from '../../../shared/jwt/jwt.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger as WinstonLogger } from 'winston';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Request, Response } from 'express';
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: WinstonLogger,
    @Inject(IJWT_SERVICE) private readonly jwtService: IJwtService,
    @InjectQueue('auth') private readonly authQueue: Queue, // Replace 'any' with the actual type if available
  ) {}
  @Post('login')
  public async login(@Req() req: Request, @Res() res: Response) {
    const token: { refreshToken: string; accessToken: string } =
      this.jwtService.generateTokenPair('id');

    console.log(token.accessToken, token.refreshToken);
    res.cookie('refreshToken', token.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    });
    await this.authQueue.add('login', {
      userId: 1,
    });
    return { message: 'User logged in successfully' };
  }
}
