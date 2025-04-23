/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from 'node:process';
import * as fs from 'fs';

async function bootstrap() {
  const keyFile = process.env.PI2025_KEY_FILE;
  const certFile = process.env.PI2025_CERT_FILE;

  const app = await NestFactory.create(AppModule,
    {
      httpsOptions: keyFile != null && certFile != null ? {
      key: fs.readFileSync(keyFile),
      cert: fs.readFileSync(certFile),
      } : undefined
    }
  );

  // Requisições permitidas de qualquer fonte
  app.enableCors({
    origin: env.PI2025_FRONTEND ?? '*',
  });

  await app.listen(env.PORT ?? 3000);
}
bootstrap();
