/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Controller, Post, Patch, Delete, Get, Param, Body, UseGuards, Request } from '@nestjs/common';
import { FormularioIdeiasService } from './formulario-ideias.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateFormularioIdeiasDto } from './dto/create-formulario-ideias.dto';
import { UpdateFormularioIdeiasDto } from './dto/update-formulario-ideias.dto';

@Controller('formularios')
export class FormularioIdeiasController {
  constructor(private readonly formularioService: FormularioIdeiasService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Request() req, @Body() dto: CreateFormularioIdeiasDto) {
    return this.formularioService.create(req.user, dto);
  }


  @Patch(':id')
  @UseGuards(AuthGuard('jwt')) // 🔒 Apenas logados podem editar
  async update(@Request() req, @Param('id') id: number, @Body() dto: UpdateFormularioIdeiasDto) {
    return this.formularioService.update(req.user, id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt')) // 🔒 Apenas ADMIN pode excluir
  async softDelete(@Request() req, @Param('id') id: number) {
    return this.formularioService.softDelete(req.user, id);
  }

  @Get()
  @UseGuards(AuthGuard('jwt')) // 🔒 Apenas ADMIN pode listar
  async findAll(@Request() req) {
    return this.formularioService.findAll(req.user);
  }

  @Get('minhas')
  @UseGuards(AuthGuard('jwt'))
  async findMine(@Request() req) {
    return this.formularioService.findByUser(req.user);
  }

}
