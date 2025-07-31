
import { Expose, Type } from 'class-transformer';
import { VoluntarioDto } from './voluntarioDto';

export class ExpedientePreviewDto {
  @Expose()
  id: number;

  @Expose()
  @Type(() => VoluntarioDto)
  voluntario: VoluntarioDto;
}



