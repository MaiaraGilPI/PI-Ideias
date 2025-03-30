import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FormularioIdeias } from './formulario-ideias.entity';
import { CreateFormularioIdeiasDto } from './dto/create-formulario-ideias.dto';
import { UpdateFormularioIdeiasDto } from './dto/update-formulario-ideias.dto';
import { User, Role } from '../users/user.entity';

@Injectable()
export class FormularioIdeiasService {
  constructor(
    @InjectRepository(FormularioIdeias)
    private formularioRepository: Repository<FormularioIdeias>,
  ) {}

  async create(user: User, dto: CreateFormularioIdeiasDto): Promise<FormularioIdeias> {
    const form = this.formularioRepository.create({ ...dto, usuario: user });
    return await this.formularioRepository.save(form);
  }

  async update(user: User, id: number, dto: UpdateFormularioIdeiasDto): Promise<FormularioIdeias> {
    const form = await this.formularioRepository.findOne({ where: { id }, relations: ['usuario'] });

    if (!form) {
      throw new NotFoundException('Formulário não encontrado.');
    }

    if (user.role !== Role.ADMIN && form.usuario.id !== user.id) {
      throw new ForbiddenException('Você não tem permissão para editar este formulário.');
    }

    Object.assign(form, dto);
    return this.formularioRepository.save(form);
  }

  async softDelete(user: User, id: number): Promise<{ message: string }> {
    const form = await this.formularioRepository.findOne({ where: { id } });

    if (!form) {
      throw new NotFoundException('Formulário não encontrado.');
    }

    if (user.role !== Role.ADMIN) {
      throw new ForbiddenException('Apenas administradores podem excluir formulários.');
    }

    form.foi_apagado = true;
    form.data_apagado = new Date();
    await this.formularioRepository.save(form);

    return { message: 'Formulário removido (deleção lógica).' };
  }

  async findAll(user: User): Promise<FormularioIdeias[]> {
    if (user.role !== Role.ADMIN) {
      throw new ForbiddenException('Apenas administradores podem listar todos os formulários.');
    }
  
    return this.formularioRepository.find({
      where: { foi_apagado: false },
      order: { data_envio: 'DESC' },
    });
  }

  async findByUser(user: User): Promise<FormularioIdeias[]> {
    return this.formularioRepository.find({
      where: { usuario: { id: user.id }, foi_apagado: false },
      relations: ['usuario'], 
      order: { data_envio: 'DESC' },
    });
  }
  
}
