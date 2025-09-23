import { Expose } from "class-transformer";

export class GetPermisosDto {
    @Expose()
    id_permiso: number;
    @Expose()
    modulo: string;
    @Expose()
    seccion: string;
}