import { IsNotEmpty, IsOptional, IsBoolean, MaxLength } from 'class-validator';

export class CreateFormularioIdeiasDto {
  @IsNotEmpty()
  titulo_projeto: string;

  @IsNotEmpty()
  descricao_ideia: string;

  @IsOptional()
  @MaxLength(255)
  como_conheceu?: string;

  @IsBoolean()
  @IsOptional()
  participar_clube?: boolean;
}
