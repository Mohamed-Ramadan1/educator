import { Controller, Inject, Post } from '@nestjs/common';
import { IJwtService } from '../../../shared/jwt/interfaces/jwt-service.interface';
import { IJWT_SERVICE } from '../../../shared/jwt/jwt.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
// import { Logger } from 'winston';
import { Logger as WinstonLogger } from 'winston';
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: WinstonLogger,
    @Inject(IJWT_SERVICE) private readonly jwtService: IJwtService,
  ) {}
  @Post('login')
  public login() {
    return { message: 'User logged in successfully' };
  }
}
