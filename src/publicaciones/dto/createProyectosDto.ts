import { IsDateString, IsString, IsBoolean, IsOptional } from 'class-validator';

export class ProyectoDto {
  @IsDateString()
  fecha: string;

  @IsString()
  Titulo: string;

  @IsString()
  Descripcion: string;

  @IsOptional()
  @IsString()
  imagenUrl: string;

}
