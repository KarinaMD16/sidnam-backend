import { IsDateString, IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class ProyectoDto {
  
  @IsDateString()
  @IsNotEmpty()
  fecha: string;

  @IsString()
  @IsNotEmpty()
  Titulo: string;

  @IsString()
  @IsNotEmpty()
  Descripcion: string;

  @IsOptional()
  @IsString()
  imagenUrl: string;

}
