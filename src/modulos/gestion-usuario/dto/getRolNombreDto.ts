import { Expose } from "class-transformer";

export class GetRolNombreDto{

    @Expose()
    nombre: string;
}