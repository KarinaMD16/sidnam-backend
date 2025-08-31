import { Expose } from "class-transformer";

export class MostrarAdministracionMedicamentoDto {
  @Expose()
  id_medicamento;
  
  @Expose()
  nombre: string;

  @Expose()
  cantidad: number;

  @Expose()
  unidad: { nombre: string; abreviatura: string };
}