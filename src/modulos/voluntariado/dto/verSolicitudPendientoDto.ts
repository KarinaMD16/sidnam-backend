import { Expose, Type } from 'class-transformer';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { HorarioPendienteDto } from './horarioPendienteDto';
import { Sexo } from 'src/common/enums/rol.enum';

export class verSolicitudPendiente {
  
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

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HorarioPendienteDto)
  @Expose()
  horarios?: HorarioPendienteDto[];
}
