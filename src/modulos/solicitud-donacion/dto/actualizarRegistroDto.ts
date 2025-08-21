import { IsBoolean, IsOptional, IsString } from "class-validator";


export class ActualizarRegistroDto {

    @IsOptional()
    @IsString()
    cedula: string;

    @IsOptional()
    @IsString()
    nombre: string;

    @IsOptional()
    @IsString()
    apellido1: string;

    @IsOptional()
    @IsString()
    apellido2: string;

    @IsOptional()
    @IsString()
    telefono: string;

    @IsOptional()
    @IsString()
    email: string;

    @IsOptional()
    @IsBoolean()
    anonimo: boolean;

    @IsOptional()
    @IsString()
    tipoDonacion: string;

    @IsOptional()
    @IsString()
    descripcion: string;

    @IsOptional()
    @IsString()
    observaciones: string;

}