import { Expose } from "class-transformer";

export class GetRolDto{
    @Expose()
    id_rol: number;
    @Expose()
    nombre: string;
}