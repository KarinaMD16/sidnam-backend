import { Type } from 'class-transformer';
import { IsInt, Min, Max } from 'class-validator';


export class ReporteMovimientosDto {

  @Type(() => Number)
  @IsInt() @Min(2000) @Max(2100)
  anio: number;

  @Type(() => Number)
  @IsInt() @Min(1) @Max(12)
  mes: number;

  @Type(() => Number)
  @IsInt() @Min(1)
  categoriaId: number;

}