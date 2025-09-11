import { Expose } from "class-transformer";

export class MostrarAreasActivas{

    @Expose()
    id_area: number;

    @Expose()
    nombre: string

}