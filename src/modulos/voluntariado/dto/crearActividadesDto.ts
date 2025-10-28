import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";


export class CrearACtividadesDto {

  @IsNotEmpty()
  fecha: Date;

  @IsOptional()
  @IsNumber()
  @Min(1)
  cantidadHoras?: number; 

  @IsNotEmpty()
  actividades: string;
   
}