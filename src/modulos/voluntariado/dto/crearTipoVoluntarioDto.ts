import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class TipoVoluntarioDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;
}