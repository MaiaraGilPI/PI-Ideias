/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Controller, Patch, Post, Get, Delete, Body, BadRequestException, Param, UseGuards, Request } from '@nestjs/common';
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

  @Patch(':id')
  @UseGuards(AuthGuard('jwt')) // 🔒 Protege a rota com JWT
  async updateUser(@Request() req, @Param('id') id: number, @Body() updateData: Partial<User>) {
    return this.usersService.updateUser(req.user, id, updateData);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt')) // 🔒 Apenas logados podem excluir
  async softDeleteUser(@Request() req, @Param('id') id: number) {
    return this.usersService.softDeleteUser(req.user, id);
  }
}
