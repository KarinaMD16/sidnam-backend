import { Expose, Transform, Type } from "class-transformer";


export class InformacionPersonalResidenteDto {
    @Expose()
    id_adulto_mayor: number;
    @Expose()
    cedula: string;
    @Expose()
    nombre: string;
    @Expose()
    apellido1: string;
    @Expose()
    apellido2: string;
    @Expose()
    email: string;
    @Expose()
    edad: number;
    @Expose()
    sexo: 'M' | 'F';

    @Expose()
       @Transform(({ value }) => {
        if (!value) return null;
        const date = new Date(value);
        return isNaN(date.getTime()) ? null : date.toLocaleDateString('es-CR');
      })
       fecha_nacimiento: string;
}