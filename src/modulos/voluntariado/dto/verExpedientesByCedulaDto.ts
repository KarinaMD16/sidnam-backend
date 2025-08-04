import { Expose, Type } from "class-transformer";
import { VoluntarioDto } from "./voluntarioDto";

export class verExpedientesByCedula {

  @Expose()
  id: number

  @Expose()
  @Type(() => VoluntarioDto)
  voluntario: VoluntarioDto

  @Expose()
  estado;
  
}