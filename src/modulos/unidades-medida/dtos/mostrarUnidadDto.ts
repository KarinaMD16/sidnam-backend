import { Expose } from "class-transformer";

export class UnidadDemMedidaDto{

    @Expose()
    id_unidad: number;

    @Expose()
    nombre: string;

    @Expose()
    abreviatura: string;
}