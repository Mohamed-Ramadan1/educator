import { Module } from '@nestjs/common';
import { JwtService } from './jwt.service';
// import { IJwtService } from './interfaces/jwt-service.interface';
export const IJWT_SERVICE = 'IJwtService';

@Module({
  providers: [
    {
      provide: IJWT_SERVICE,
      useClass: JwtService,
    },
  ],
  exports: [IJWT_SERVICE],
})
export class JwtModule {}
