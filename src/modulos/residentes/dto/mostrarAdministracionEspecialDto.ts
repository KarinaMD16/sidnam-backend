import { Expose, Type } from "class-transformer";
import { UnidadMedidaDto } from "./unidadMedidaDto";
import { MedicamentoDto } from "./medicamentosDto";

export class MostrarMedicamentoEspecial{
    @Expose()
    hora: string;

    @Expose()
    cantidad: number;

    @Expose()
    @Type(() => MedicamentoDto)
    medicamento: MedicamentoDto;

    @Expose()
    @Type(() => UnidadMedidaDto)
    unidad: UnidadMedidaDto;

}