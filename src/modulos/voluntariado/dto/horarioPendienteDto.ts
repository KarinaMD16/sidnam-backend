import { Expose } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class HorarioPendienteDto {
  @IsString()
  @IsNotEmpty()
  @Expose()
  dia: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  horaInicio: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  horaFin: string;
}