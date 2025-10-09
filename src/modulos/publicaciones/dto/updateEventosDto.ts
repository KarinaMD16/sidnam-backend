import { IsString, IsOptional } from 'class-validator';

export class updateEventosDto {
  @IsString()
  @IsOptional()
  fecha: string; 
  
  @IsString()
  @IsOptional()
  Titulo: string;

  @IsString()
  @IsOptional()
  Descripcion: string;

  @IsString()
  @IsOptional()
  imagenUrl: string;


}
