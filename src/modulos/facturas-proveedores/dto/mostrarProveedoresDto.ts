import { Expose } from "class-transformer";

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

}