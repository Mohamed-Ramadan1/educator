import { Module } from '@nestjs/common';
// import { JwtService } from './jwt.service';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { JwtService } from './jwt.service';
import { jwtConfig } from '@config/index'; // Assuming this has accessTokenSecret etc.

export const IJWT_SERVICE = 'IJwtService';

@Module({
  imports: [
    NestJwtModule.register({
      secret: jwtConfig.accessTokenSecret, // This can be any default; you're overriding it per use
      signOptions: {
        expiresIn: jwtConfig.accessTokenExpiresIn,
      },
    }),
  ],
  providers: [
    {
      provide: IJWT_SERVICE,
      useClass: JwtService,
    },
  ],
  exports: [IJWT_SERVICE],
})
export class JwtModule {}
