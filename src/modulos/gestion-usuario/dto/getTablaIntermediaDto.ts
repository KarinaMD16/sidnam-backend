import { GetPermisosDto } from "./getPermisosDto";
import { Expose, Type } from "class-transformer";
import { GetAccionesDto } from "./getAccionDto";

export class GetTablaIntermediaDto {

    @Expose()
    @Type(() => GetPermisosDto)
    permiso: GetPermisosDto;

    @Expose()
    @Type(() => GetAccionesDto)
    accion: GetAccionesDto; 
}