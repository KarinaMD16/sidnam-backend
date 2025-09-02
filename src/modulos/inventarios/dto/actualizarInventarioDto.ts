import { IsOptional, IsString, IsInt, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';

export class PatchEditarInventarioDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  codigo?: string;

  @IsOptional()
  @IsInt()
  unidadMedida?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  stock?: number;

  @IsOptional()
  @IsInt()
  subcategoriaId?: number;

  @IsOptional()
  @IsString()
  imagen_url?: string; 

}