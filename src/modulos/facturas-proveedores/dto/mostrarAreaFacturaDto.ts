import { Expose } from "class-transformer";

export class MostrarAreaFactura{

    @Expose()
    id_area: number;

    @Expose()
    nombre: string

}