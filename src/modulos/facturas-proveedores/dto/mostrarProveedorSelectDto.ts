import { Expose, Type } from "class-transformer";
import { MostrarAreaFactura } from "./mostrarAreaFacturaDto";

export class MostrarProveedoresSelect{

    @Expose()
    id_proveedor: number;

    @Expose()
    nombre: string;

}