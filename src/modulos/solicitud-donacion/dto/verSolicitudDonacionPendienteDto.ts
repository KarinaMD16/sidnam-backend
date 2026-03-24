import { Expose, Transform } from "class-transformer";
import { formatDateCR } from "src/common/helper/Intl.DateTimeFormat";

export class VerSolicitudDonacionPendienteDto{

  @Expose()
  id: number;

  @Expose()
  cedula: string;

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
    @Transform(({ value }) => (value ? formatDateCR(value) : value))
    creadoEn: string;

  @Expose()
  observaciones: string

}