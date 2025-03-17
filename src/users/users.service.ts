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
}
