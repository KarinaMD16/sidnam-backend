import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";


export class CrearACtividadesDto {

  @IsNotEmpty()
  fecha: Date;

  @IsOptional()
  @IsNumber()
  cantidadHoras?: number; 

  @IsNotEmpty()
  actividades: string;
   
}