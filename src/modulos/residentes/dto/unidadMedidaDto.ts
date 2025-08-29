import { Expose } from "class-transformer";

export class UnidadMedidaDto {
  @Expose()
  id: number;

  @Expose()
  nombre: string;

  @Expose()
  abreviatura: string;
}
