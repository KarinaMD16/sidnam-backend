import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";


export class CrearSolicitudPendienteDto {

    @IsString()
    @IsNotEmpty()
    cedula: string;
    
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsNotEmpty()
    apellido1: string;

    @IsString()
    @IsOptional()
    apellido2?: string;

    @IsString()
    @IsNotEmpty()
    telefono: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsBoolean()
    @IsOptional()
    anonimo?: boolean;

    @IsString()
    @IsNotEmpty()
    descripcion: string;

    @IsString()
    tipoDonacion: string;

    @IsOptional()
    @IsString()
    observaciones?: string;
}

