import { IsOptional, IsString, IsDateString } from 'class-validator';

export class AtualizarLibroCampoDto {
  @IsString()
  @IsOptional()
  descripcionCompleta?: string;   

  @IsString()
  @IsOptional()
  problematica?: string;         

  @IsDateString()
  @IsOptional()
  fecha_actividad?: string;     

  @IsString()
  @IsOptional()
  acuerdo_alcanzado?: string;   
}
