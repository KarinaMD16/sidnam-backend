import { Expose, Transform, Type } from 'class-transformer';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { HorarioPendienteDto } from './horarioPendienteDto';
import { Sexo } from 'src/common/enums/rol.enum';
import { ContactoEmergenciaDto } from './verContactoEmergenciaDto';
import { formatDateCR } from 'src/common/helper/Intl.DateTimeFormat';

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
  @Transform(({ value }) => (value ? formatDateCR(value) : value))
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
