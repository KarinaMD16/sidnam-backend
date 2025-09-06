import { Expose, Type } from "class-transformer";
import { MostrarAreaFactura } from "./mostrarAreaFacturaDto";

export class MostrarProveedoresFacturas{

    @Expose()
    id_proveedor: number;

    @Expose()
    nombre: string;

    @Expose()
    @Type(() => MostrarAreaFactura)
    area: MostrarAreaFactura;
}