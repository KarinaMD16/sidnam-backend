// horario.dto.ts
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class HorarioDto {

  @IsOptional()
  @IsNumber()
  id?: number;
  
  @IsString()
  dia: string;

  @IsString()
  horaInicio: string;

  @IsString()
  horaFin: string;
}
