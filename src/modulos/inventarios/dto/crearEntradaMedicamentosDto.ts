import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNumber, Min, ValidateNested } from 'class-validator';

export class CrearEntradaMedicamentoItemDto {

  @IsInt()
  medicamentoId: number;

  @IsInt()
  unidadMedidaId: number;

  @IsNumber()
  @Min(1, { message: 'La cantidad debe ser mayor que 0' })
  cantidad: number;

}

export class CrearEntradaMedicamentoDto {
  @IsArray({ message: 'items debe ser un arreglo' })
  @ValidateNested({ each: true })
  @Type(() => CrearEntradaMedicamentoItemDto)
  items: CrearEntradaMedicamentoItemDto[];
}
