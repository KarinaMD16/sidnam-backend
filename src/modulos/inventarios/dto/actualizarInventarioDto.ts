import { IsOptional, IsString, IsInt, Min } from 'class-validator';
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

  @IsOptional()
  @IsInt()
  @Min(1)
  categoriaId?: number;

}