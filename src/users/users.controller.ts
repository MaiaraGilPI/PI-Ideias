/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Post, Body, BadRequestException, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersService.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new BadRequestException('Email já está em uso.');
    }
    return this.usersService.createUser(createUserDto);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt')) // 🔒 Essa rota só pode ser acessada por usuários logados
  getProfile() {
    return { message: 'Você está autenticado!' };
  }
}
