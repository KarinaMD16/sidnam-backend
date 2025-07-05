import { IsDateString, IsNotEmpty, IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class GaleriaDto {
    
  
  @IsString()
  imagenUrl: string;

  @IsNumber()
  categoriaId: number;
}
