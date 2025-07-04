import { IsDateString, IsString, IsBoolean, IsOptional } from 'class-validator';

export class updateProyectoDto {
  @IsDateString()
  fecha: string;

  @IsString()
  Titulo: string;

  @IsString()
  Descripcion: string;

}
