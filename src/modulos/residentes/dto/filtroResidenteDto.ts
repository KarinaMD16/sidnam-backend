import { IsString } from 'class-validator';

export class FiltroResidenteDto {
  @IsString()
  filtro: string;
}
