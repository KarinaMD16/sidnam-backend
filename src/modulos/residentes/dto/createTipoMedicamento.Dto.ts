import { IsNotEmpty, IsString } from "class-validator";

export class Tipo_MedicamentoDto {
    
  @IsNotEmpty()
  @IsString()
  nombre: string;
}
