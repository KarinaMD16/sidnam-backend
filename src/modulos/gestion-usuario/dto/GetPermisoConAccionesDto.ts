import { Expose, Type } from "class-transformer";
import { GetAccionesDto } from "./getAccionDto";

export class GetPermisoConAccionesDto {
  @Expose()
  id_permiso: number;

  @Expose()
  modulo: string;

  @Expose()
  seccion: string;

  @Expose() 
  @Type(() => GetAccionesDto)
  acciones: GetAccionesDto[];
}
