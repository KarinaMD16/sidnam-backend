import { IsDateString, IsOptional } from 'class-validator';

export class HandleEstadoEventoDto {
  @IsOptional()
  @IsDateString()
  fecha?: string;
}
