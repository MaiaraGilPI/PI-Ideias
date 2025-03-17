import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FormularioIdeiasModule } from './formulario-ideias/formulario-ideias.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'adept',
      password: 'system123',
      database: 'rotaract_ideias',
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
