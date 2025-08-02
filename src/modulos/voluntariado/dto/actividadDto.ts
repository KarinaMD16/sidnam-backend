import { Expose, Transform } from "class-transformer";


export class ActividadDto {

  @Expose()
  id: number
  
  @Expose()
  @Transform(({ value }) => {
    if (!value) return null;
    const fecha = new Date(value);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
  })
  fecha: string;

  @Expose()
  cantidadHoras: number;

  @Expose()
  actividades: string;
}

