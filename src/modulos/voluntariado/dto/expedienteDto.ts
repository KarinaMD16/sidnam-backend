import { Expose, Type } from 'class-transformer';
import { VoluntarioDto } from './voluntarioDto';
import { HorarioPendienteDto } from './horarioPendienteDto';
import { ActividadDto } from './actividadDto';
import { TipoVoluntariadoDto } from './tipoVoluntarioDto';
import { VoluntarioExpedienteDto } from './verVoluntarioExpediente';
import { ContactoEmergenciaDto } from './verContactoEmergenciaDto';

export class ExpedienteAprobadoDto {
  @Expose()
  id: number;

  @Expose()
  datosExtra: string;

  @Expose()
  observaciones: string;

  @Expose()
  @Type(() => VoluntarioExpedienteDto)
  voluntario: VoluntarioExpedienteDto;

  @Expose()
  @Type(() => HorarioPendienteDto)
  horarios: HorarioPendienteDto[];

  @Expose()
  @Type(() => ActividadDto)
  actividades: ActividadDto[];

  @Expose()
  @Type(() => TipoVoluntariadoDto)
  tipoVoluntariado: TipoVoluntariadoDto;

  @Expose()
  @Type(() => ContactoEmergenciaDto)
  contactoEmergencia: ContactoEmergenciaDto;
}
