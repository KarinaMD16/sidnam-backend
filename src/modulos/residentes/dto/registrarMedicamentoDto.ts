import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { Turno } from 'src/common/enums/turno.enum';

export class CreateAdministracionDto {
  @IsEnum(Turno)
  @IsNotEmpty()
  turno: Turno;

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
