import { Expose, Type } from "class-transformer";
import { GetRolNombreDto } from "./getRolNombreDto";

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

    @Expose()
    @Type(() => GetRolNombreDto)
    rol: GetRolNombreDto;

}