import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as morgan from 'morgan'; // ✅ Use CommonJS import
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.use(morgan('combined'));
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  // app.getHttpAdapter().getInstance().set('trust proxy', 1); // Trust first proxy, useful for reverse proxies like Nginx

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
