/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 💥 Libera requisições do front em http://localhost:5173 (Vite)
  app.enableCors({
    origin: 'http://localhost:5173',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
