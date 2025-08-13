import { Expose } from "class-transformer";

export class DonadorRegistroDto {

    @Expose()
    id: number;

    @Expose()
    cedula: string;

    @Expose()
    nombre: string;

    @Expose()
    apellido1: string;

    @Expose()
    apellido2: string;

    @Expose()
    telefono: string;

    @Expose()
    email: string;

}