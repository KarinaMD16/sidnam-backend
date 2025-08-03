import { Expose, Transform, Type } from 'class-transformer';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { HorarioPendienteDto } from './horarioPendienteDto';
import { Sexo } from 'src/common/enums/rol.enum';
import { ContactoEmergenciaDto } from './verContactoEmergenciaDto';

export class verSolicitud{
  
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
  tipoVoluntariado: number;

  @Expose()
  cantidadHoras: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HorarioPendienteDto)
  @Expose()
  horarios?: HorarioPendienteDto[];

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
  estado: 'pendiente' | 'aprobada' | 'rechazada';

 @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContactoEmergenciaDto)
  @Expose()
  contactosEmergencia: ContactoEmergenciaDto[];

  @Expose()
  observaciones: string;
}
