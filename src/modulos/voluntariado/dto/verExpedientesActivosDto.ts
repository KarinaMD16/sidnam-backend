import { Expose, Type } from "class-transformer";
import { VoluntarioDto } from "./voluntarioDto";

export class VerExpedientesActivosDto {

  @Expose()
  id: number

  @Expose()
  @Type(() => VoluntarioDto)
  voluntario: VoluntarioDto
  
}