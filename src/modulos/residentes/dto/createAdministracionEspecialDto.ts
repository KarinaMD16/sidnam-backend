import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAdministracionEspecialDto {

  @IsString()
  @IsNotEmpty()
  hora: string;

  @IsNumber()
  @Type(() => Number)
  id_medicamento: number;

  @IsNumber()
  @Type(() => Number)
  id_unidadMedida: number;

  @IsNumber()
  @Type(() => Number)
  cantidad: number;
}
