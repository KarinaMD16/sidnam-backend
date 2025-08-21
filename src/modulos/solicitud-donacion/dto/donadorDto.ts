import { Expose } from "class-transformer";


export class DonadorDto {

    @Expose()
    nombre: string;

    @Expose()
    apellido1: string;

    @Expose()
    apellido2: string;

}