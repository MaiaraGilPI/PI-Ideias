/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from 'node:process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Requisições permitidas de qualquer fonte
  app.enableCors({
    origin: env.PI2025_FRONTEND ?? '*',
  });

  await app.listen(env.PORT ?? 3000);
}
bootstrap();
