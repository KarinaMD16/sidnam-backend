import { Expose, Transform, Type } from "class-transformer";
import { VoluntarioDto } from "./voluntarioDto";

export class verActividadesDto {

  @Expose()
  id: number

  @Expose()
  @Expose()
  @Transform(({ value }) => {
    if (!value) return null;
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date.toLocaleDateString('es-CR');
    })
  fecha: string

  @Expose()
  estado;

  @Expose()
  cantidadHoras: number;

  @Expose()
  actividades: string
  
}