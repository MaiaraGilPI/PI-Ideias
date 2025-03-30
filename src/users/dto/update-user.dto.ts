import { IsOptional, IsEmail, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  fullName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @MinLength(6)
  password?: string;
}
