import { Expose, Type } from "class-transformer";
import { UnidadMedidaDto } from "./unidadMedidaDto";
import { MedicamentoDto } from "./medicamentosDto";

export class MostrarAdministracionesDto{
    @Expose()
    turno: string

    @Expose()
    @Type(() => MedicamentoDto)
    medicamento: MedicamentoDto;

    @Expose()
    cantidad: number

    @Expose()
    @Type(() => UnidadMedidaDto)
    unidad: UnidadMedidaDto;

}