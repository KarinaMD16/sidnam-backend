import { IsNotEmpty, IsString } from "class-validator";

export class ContactoEmergenciaPendienteDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  telefono: string;
}