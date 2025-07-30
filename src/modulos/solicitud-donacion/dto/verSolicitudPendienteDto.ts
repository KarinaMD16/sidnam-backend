import { Expose, Transform } from "class-transformer";

export class VerSolicitudPendienteDto{

  @Expose()
  id: number;

  @Expose()
  nombre: string;

  @Expose()
  apellido1: string;

  @Expose()
  apellido2: string;

  @Expose()
  telefono: string;

  @Expose()
  email: string;

  @Expose()
  anonimo: boolean;

  @Expose()
  descripcion: string;

  @Expose()
  tipoDonacion: number;

  @Expose()
  estado: 'pendiente' | 'aprobada' | 'rechazada';

  @Expose()
  @Transform(({ value }) => {
      if (!value) return value;
      // value es un objeto Date
      const fecha = new Date(value);
      // Formato: dd/mm/yyyy
      const dia = String(fecha.getDate()).padStart(2, '0');
      const mes = String(fecha.getMonth() + 1).padStart(2, '0');
      const anio = fecha.getFullYear();
      return `${dia}/${mes}/${anio}`;
  })
    creadoEn: string;

  @Expose()
  observaciones: string

}