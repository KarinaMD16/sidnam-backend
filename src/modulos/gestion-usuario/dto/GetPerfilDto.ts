import { Expose, Transform, Type } from "class-transformer";
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

    @Expose()
    imagenUrl: string;

    @Expose()
      @Transform(({ value }) => {
        if (!value) return null;
        const date = value instanceof Date ? value : new Date(value);
        const d = date.getDate().toString().padStart(2, '0');
        const m = (date.getMonth() + 1).toString().padStart(2, '0');
        const y = date.getFullYear().toString().slice(-2);
        return `${d}-${m}-${y}`;
    })
    createdAt: string;
      

}