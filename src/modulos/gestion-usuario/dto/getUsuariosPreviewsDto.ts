import { Expose, Type } from 'class-transformer';
import { GetRolDto } from './getRolDto';

export class UsuarioPreviewDto {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    apellido1: string;

    @Expose()
    apellido2: string;

    @Expose()
    email: string;

    @Expose()
    cedula: string;

    @Expose()
    estado: string; 

    @Expose()
    @Type(() => GetRolDto)
    rol: GetRolDto;
}
