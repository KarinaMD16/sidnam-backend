import { IsNotEmpty, IsString } from "class-validator";


export class CrearACtividadesDto {

  @IsNotEmpty()
  fecha: Date;

  @IsNotEmpty()
  cantidadHoras: number; 

  @IsNotEmpty()
  actividades: string;
   
}