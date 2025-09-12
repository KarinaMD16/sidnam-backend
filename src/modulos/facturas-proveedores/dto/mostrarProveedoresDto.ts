import { Expose, Type } from "class-transformer";
import { MostrarAreaFactura } from "./mostrarAreaFacturaDto";

export class MostrarProveedores{

    @Expose()
    id_proveedor: number;

    @Expose()
    nombre: string;

    @Expose()
    numero: number;

    @Expose()
    correo: string;

    @Expose()
    direccion: string;

    @Expose()
    @Type(() => MostrarAreaFactura)
    area: MostrarAreaFactura;


}