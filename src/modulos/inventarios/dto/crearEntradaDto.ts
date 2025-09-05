import { Type } from 'class-transformer';
import { IsArray, IsInt, Min, ValidateNested } from 'class-validator';

export class CrearEntradaProductoDto {
  @IsInt()
  inventarioId: number;

  @IsInt()
  @Min(1, { message: 'La cantidad debe ser mayor a 0' })
  cantidad: number;
}

export class CrearEntradaDto {
  @IsArray({ message: 'productos debe ser un arreglo' })
  @ValidateNested({ each: true })
  @Type(() => CrearEntradaProductoDto)
  productos: CrearEntradaProductoDto[];
  
}