import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";


export class CrearSolicitudPendienteDto {
    
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsNotEmpty()
    apellido1: string;

    @IsString()
    @IsNotEmpty()
    apellido2: string;

    @IsString()
    @IsNotEmpty()
    telefono: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsBoolean()
    @IsOptional()
    anonimo?: boolean;

    @IsString()
    @IsNotEmpty()
    descripcion: string;

    @IsNumber()
    tipoDonacion: number;

    @IsOptional()
    @IsString()
    observaciones?: string;
}
