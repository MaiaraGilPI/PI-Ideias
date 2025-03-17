/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Role } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  [x: string]: any;
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { fullName, email, password } = createUserDto;

    try {
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
        role: Role.USER, // Sempre começa como USER
      });

      return await this.usersRepository.save(user);
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      throw new InternalServerErrorException('Erro ao cadastrar usuário. Verifique os logs.');
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }
}
