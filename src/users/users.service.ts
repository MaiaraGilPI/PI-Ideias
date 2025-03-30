/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Role } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { fullName, email, password, telefone, recuperacao, dica_recuperacao } = createUserDto;

    const existingUser = await this.usersRepository.findOne({ where: { email } });

    if (existingUser) {
      throw new BadRequestException('Email já está em uso.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.usersRepository.create({
      fullName,
      email,
      password: hashedPassword,
      telefone,
      recuperacao,
      dica_recuperacao,
      role: Role.USER,
    });

    return await this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async updateUser(adminUser: User, userId: number, updateData: Partial<User>): Promise<User> {
    if (adminUser.role !== Role.ADMIN) {
      throw new ForbiddenException('Apenas administradores podem editar usuários.');
    }

    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    Object.assign(user, updateData); // Atualiza os campos enviados
    return this.usersRepository.save(user);
  }

  async softDeleteUser(adminUser: User, userId: number): Promise<{ message: string }> {
    if (adminUser.role !== Role.ADMIN) {
      throw new ForbiddenException('Apenas administradores podem excluir usuários.');
    }

    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    user.recuperacao = 'REMOVIDO';
    user.dica_recuperacao = 'REMOVIDO';
    user.telefone = undefined;
    user.email = `deleted-${user.id}@example.com`;
    user.fullName = 'Usuário Removido';

    await this.usersRepository.save(user);

    return { message: 'Usuário removido (deleção lógica).' };
  }

  async redefinirSenha(email: string, chave: string, novaSenha: string): Promise<{ message: string }> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('Usuário não encontrado.');
    if (user.recuperacao !== chave) throw new ForbiddenException('Palavra-chave incorreta.');
  
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(novaSenha, salt);
    await this.usersRepository.save(user);
    return { message: 'Senha redefinida com sucesso.' };
  }

  async validarRecuperacao(email: string, chave: string): Promise<{ valid: boolean }> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('Usuário não encontrado.');
    if (user.recuperacao !== chave) throw new ForbiddenException('Palavra-chave incorreta.');
    return { valid: true };
  }

  async findAll(requestingUser: User): Promise<User[]> {
    if (requestingUser.role !== Role.ADMIN) {
      throw new ForbiddenException('Apenas administradores podem listar usuários.');
    }
  
    return this.usersRepository.find();
  }
  
}
