import { IsEmail, IsNotEmpty, MinLength, MaxLength, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsOptional() // 📌 Campo opcional
  telefone?: string;

  @IsNotEmpty()
  @MaxLength(100) // 📌 Deve ter no máximo 100 caracteres
  recuperacao: string;

  @IsNotEmpty()
  @MaxLength(100) // 📌 Deve ter no máximo 100 caracteres
  dica_recuperacao: string;
}
