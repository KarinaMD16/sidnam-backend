import { IsOptional, IsString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class PatchEditarInventarioDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  codigo?: string;

  @IsOptional()
  @IsString()
  unidadMedida?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  stock?: number;
}