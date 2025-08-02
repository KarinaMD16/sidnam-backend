import { Expose, Transform, Type } from 'class-transformer';
import { Sexo } from 'src/common/enums/rol.enum';
import { ContactoEmergenciaDto } from './verContactoEmergenciaDto';


export class VoluntarioExpedienteDto {
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
  email: string;

  @Expose()
  telefono: string;

  @Expose()
  ocupacion: string;

  @Expose()
  direccion: string;

  @Expose()
  sexo: Sexo;

  @Expose()
  experienciaLaboral?: string;

  @Expose()
  @Transform(({ value }) => {
    if (!value) return null;
    const fecha = new Date(value);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
  })
  creadoEn: string;

  @Expose()
  @Type(() => ContactoEmergenciaDto)
  contactosEmergencia: ContactoEmergenciaDto[];
}
