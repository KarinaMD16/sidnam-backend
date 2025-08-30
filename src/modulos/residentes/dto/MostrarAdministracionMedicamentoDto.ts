import { Expose } from "class-transformer";

export class MostrarAdministracionMedicamentoDto {

  @Expose()
  nombre: string;

  @Expose()
  cantidad: number;

  @Expose()
  unidad: { nombre: string; abreviatura: string };
}