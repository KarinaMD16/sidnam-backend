import { Expose } from "class-transformer";

export class GetRolesDto{
    @Expose()
    id_rol: number;

    @Expose()
    nombre: string;

    @Expose()
    descripcion: string;

    @Expose()
    estado: boolean;
}