import { Expose, Transform } from "class-transformer";

export class SolicitudDonacionPreviewDto{

  @Expose()
  id: number;

  @Expose()
  nombre: string;

  @Expose()
  apellido1: string;

  @Expose()
  apellido2: string;

  @Expose()
  tipoDonacion: string;

  @Expose()
  @Transform(({ value }) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase())
  estado: string;

  @Expose()
  @Transform(({ value }) => {
    if (!value) return null;
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date.toLocaleDateString('es-CR');
  })
  creadoEn: string; 
}
