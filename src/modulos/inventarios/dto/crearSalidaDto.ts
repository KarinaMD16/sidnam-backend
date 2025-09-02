// dto/crearSalidaDto.ts
import { Type } from 'class-transformer';
import { IsArray, ValidateNested, ArrayMinSize, IsInt, Min } from 'class-validator';



export class CrearSalidaItemDto {
  @IsInt()
  @Min(1, { message: 'El inventarioId debe ser mayor que 0' })
  inventarioId: number;

  @IsInt()
  @Min(1, { message: 'La cantidad debe ser mayor a 0' })
  cantidad: number;
}

export class CrearSalidaDto {
  @IsArray({ message: 'productos debe ser un arreglo' })
  @ArrayMinSize(1, { message: 'Debe incluir al menos un producto' })
  @ValidateNested({ each: true })
  @Type(() => CrearSalidaItemDto)
  productos: CrearSalidaItemDto[];
}
