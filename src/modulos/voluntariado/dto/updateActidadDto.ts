import { IsOptional, Min } from "class-validator";

export class ActualizarActividadesDto {
  @IsOptional()
  fecha?: Date;

  @IsOptional()
  @Min(1)
  cantidadHoras?: number;

  @IsOptional()
  actividades?: string;
}