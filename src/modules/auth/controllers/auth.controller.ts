import { Controller, Inject, Post, UsePipes } from '@nestjs/common';
import { IJwtService } from '../../../shared/jwt/interfaces/jwt-service.interface';
import { IJWT_SERVICE } from '../../../shared/jwt/jwt.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger as WinstonLogger } from 'winston';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { AuthService } from '../services/auth.service';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: WinstonLogger,
    @Inject(IJWT_SERVICE) private readonly jwtService: IJwtService,
    @InjectQueue('auth') private readonly authQueue: Queue,
  ) {}

  @Post('register')
  @UsePipes()
  public async register(): Promise<void> {}

  @Post('login')
  public async login() {}
}
