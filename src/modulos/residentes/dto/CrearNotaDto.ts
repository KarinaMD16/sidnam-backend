import { IsNotEmpty } from 'class-validator';

export class CrearNotaDto {
  @IsNotEmpty()
  titulo: string;

  @IsNotEmpty()
  textoCompleto: string;
}
