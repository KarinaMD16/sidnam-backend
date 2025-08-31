import { IsOptional, IsString, IsDateString } from 'class-validator';

export class CrearLibroCampoDto {
  @IsString()
  descripcionCompleta: string;   

  @IsString()
  problematica?: string;         

  @IsDateString()
  fecha_actividad?: string;     

  @IsString()
  acuerdo_alcanzado?: string;   
}
