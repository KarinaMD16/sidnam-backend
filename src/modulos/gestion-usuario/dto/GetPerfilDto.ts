import { Expose } from "class-transformer";

export class PerfilUsuario{

    @Expose()
    id: number;

    @Expose()
    cedula: string;

    @Expose()
    name: string;

    @Expose()
    apellido1: string;

    @Expose()
    apellido2: string;

    @Expose()
    email: string;

}