import { IsNotEmpty, IsString } from "class-validator";
import { TipoVoluntario } from "src/common/enums/tipoVoluntarios.enum";

export class TipoVoluntarioDto{
     @IsString()
      @IsNotEmpty()
      nombre: TipoVoluntario;
}