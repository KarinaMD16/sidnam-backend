import { Expose, Type } from "class-transformer";
import { GetPermisosDto } from "./getPermisosDto";
import { GetTablaIntermediaDto } from "./getTablaIntermediaDto";
import { GetPermisoConAccionesDto } from "./GetPermisoConAccionesDto";

export class GetRolesPermisosAccionesDto {
    
    @Expose()
    id_rol: number;

    @Expose()
    nombre: string;

    @Expose()
    descripcion: string;

    @Expose()
    estado: boolean
    
    @Expose()
    @Type(() => GetPermisoConAccionesDto)
    permisos: GetPermisoConAccionesDto[];

}