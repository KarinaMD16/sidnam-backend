import { IsNotEmpty, IsString } from 'class-validator';

export class CrearSubcategoriaDto {

  @IsString()
  @IsNotEmpty()
  nombre: string;
  
}