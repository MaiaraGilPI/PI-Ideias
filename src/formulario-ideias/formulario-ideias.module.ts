import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormularioIdeias } from './formulario-ideias.entity';
import { FormularioIdeiasService } from './formulario-ideias.service';
import { FormularioIdeiasController } from './formulario-ideias.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FormularioIdeias])],
  controllers: [FormularioIdeiasController],
  providers: [FormularioIdeiasService],
  exports: [FormularioIdeiasService], // 🔥 Caso precise injetar em outro módulo
})
export class FormularioIdeiasModule {}
