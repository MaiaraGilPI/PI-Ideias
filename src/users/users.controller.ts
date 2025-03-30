import {
  Controller,
  Patch,
  Post,
  Get,
  Delete,
  Body,
  BadRequestException,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 📌 Cadastro
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersService.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new BadRequestException('Email já está em uso.');
    }
    return this.usersService.createUser(createUserDto);
  }

  // 🔒 Perfil protegido
  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile() {
    return { message: 'Você está autenticado!' };
  }

  // 🔄 Atualizar usuário
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async updateUser(
    @Request() req: { user: User },
    @Param('id') id: number,
    @Body() updateData:  UpdateUserDto
  ) {
    return this.usersService.updateUser(req.user, id, updateData);
  }

  // ❌ Deleção lógica
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async softDeleteUser(@Request() req: { user: User }, @Param('id') id: number) {
    return this.usersService.softDeleteUser(req.user, id);
  }

  // 🔍 Recuperação de senha - Etapa 1: buscar dica
  @Get('recuperar/:email')
  async recuperarSenha(@Param('email') email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('Usuário não encontrado.');
    }

    return {
      email: user.email,
      dica_recuperacao: user.dica_recuperacao,
    };
  }

  // ✅ Recuperação de senha - Etapa 2: validar palavra-chave
  @Post('recuperar/validar/:email')
  async validarRecuperacao(
    @Param('email') email: string,
    @Body() body: { recuperacao: string },
  ) {
    return this.usersService.validarRecuperacao(email, body.recuperacao);
  }

  // 🔐 Recuperação de senha - Etapa 3: redefinir senha
  @Patch('recuperar/:email')
  async redefinirSenha(
    @Param('email') email: string,
    @Body() body: { recuperacao: string; novaSenha: string }
  ) {
    return this.usersService.redefinirSenha(email, body.recuperacao, body.novaSenha);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(@Request() req: { user: User }) {
    return this.usersService.findAll(req.user);
  }

}
