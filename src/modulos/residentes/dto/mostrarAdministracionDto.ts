import { Expose, Type } from "class-transformer";
import { MostrarAdministracionMedicamentoDto } from "./MostrarAdministracionMedicamentoDto";


export class MostrarAdministracionMedicamentosDto{
    @Expose()
    cantidad: number;

    @Expose()
    @Type(() => MostrarAdministracionMedicamentoDto)
    medicamento: MostrarAdministracionMedicamentoDto;
}