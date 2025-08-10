import { IsOptional } from "class-validator";

export class ActualizarActividadesDto {
  @IsOptional()
  fecha?: Date;

  @IsOptional()
  cantidadHoras?: number;

  @IsOptional()
  actividades?: string;
}