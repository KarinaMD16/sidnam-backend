import { IsDateString, IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CategoriaDto {
    
  @IsString()
  nombre: string;

  @IsString()
  descripcion: string;

}
