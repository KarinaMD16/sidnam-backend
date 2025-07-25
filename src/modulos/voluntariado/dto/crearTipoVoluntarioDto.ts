import { IsNotEmpty, IsString } from "class-validator";

export class TipoVoluntarioDto{
     @IsString()
      @IsNotEmpty()
      nombre: string;
}