import { Expose, Transform } from 'class-transformer';
import { formatDateCR } from 'src/common/helper/Intl.DateTimeFormat';

export class SolicitudPreviewDto {
  @Expose()
  id: number;

  @Expose()
  nombre: string;

  @Expose()
  apellido1: string;

  @Expose()
  apellido2: string;

  @Expose()
  @Transform(({ value }) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase())
  estado: string;

  @Expose()
    @Transform(({ value }) => (value ? formatDateCR(value) : value))
    creadoEn: string;
}
