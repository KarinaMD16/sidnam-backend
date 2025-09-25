import { IsDateString, IsString, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';

export class EventoDto {
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
