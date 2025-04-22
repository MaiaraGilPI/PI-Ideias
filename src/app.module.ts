import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FormularioIdeiasModule } from './formulario-ideias/formulario-ideias.module';
import { env } from 'node:process';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: env.PI2025_HOST ?? 'localhost',
      port: Number(env.PI2025_PORT) ?? 3306,
      username: env.PI2025_USERNAME ?? '',
      password: env.PI2025_PASSWORD ?? '',
      database: env.PI2025_DATABASE ?? 'pi2025',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    FormularioIdeiasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
