import { IsDateString, IsString, IsOptional } from 'class-validator';

export class updateDonacionDto {
  @IsDateString()
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
