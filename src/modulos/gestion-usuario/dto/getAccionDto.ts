import { Expose } from "class-transformer";

export class GetAccionesDto {
    @Expose()
    id_accion: number;
    @Expose()
    accion: string;

    @Expose()
    activo: boolean;
}