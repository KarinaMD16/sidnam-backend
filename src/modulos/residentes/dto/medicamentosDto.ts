import { Expose } from "class-transformer";

export class MedicamentoDto {
  @Expose()
  id: number;

  @Expose()
  nombre: string;
}
