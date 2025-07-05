import { IsDateString, IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class updateEventosDto {
  @IsDateString()
  @IsNotEmpty()
  fecha: string; 
  
  @IsString()
  @IsNotEmpty()
  Titulo: string;

  @IsString()
  @IsNotEmpty()
  Descripcion: string;


}
