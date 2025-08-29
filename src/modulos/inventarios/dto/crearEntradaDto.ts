// dto/crear-entrada-lote.dto.ts
import { Type } from 'class-transformer';
import { IsArray, IsInt, ValidateNested, Min } from 'class-validator';

export class CrearEntradaItemDto {
  @IsInt()
  inventarioId: number;

  @IsInt()
  @Min(1)
  cantidad: number;
}

export class CrearEntradaLoteDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CrearEntradaItemDto)
  productos: CrearEntradaItemDto[];
}