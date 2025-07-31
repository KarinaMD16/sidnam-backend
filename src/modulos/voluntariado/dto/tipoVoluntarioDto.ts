import { Expose } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class TipoVoluntariadoDto {

  @Expose()
  id: number
  
  @IsString()
  @IsNotEmpty()
  @Expose()
  nombre: string;

}