import { IsOptional, MaxLength, IsBoolean } from 'class-validator';

export class UpdateFormularioIdeiasDto {
  @IsOptional()
  titulo_projeto?: string;

  @IsOptional()
  descricao_ideia?: string;

  @IsOptional()
  @MaxLength(255)
  como_conheceu?: string;

  @IsBoolean()
  @IsOptional()
  participar_clube?: boolean;
}
