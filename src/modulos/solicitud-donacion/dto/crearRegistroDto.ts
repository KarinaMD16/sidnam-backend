import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";



export class CrearRegistroDto {

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
    apellido2: string;

    @IsString()
    @IsNotEmpty()
    telefono: string;
    
    @IsString()
    @IsNotEmpty()
    email: string;
    
    @IsBoolean()
    @IsNotEmpty()
    anonimo: boolean;

    @IsString()
    @IsNotEmpty()
    tipoDonacion: string;

    @IsString()
    @IsOptional()
    descripcion: string;

    @IsString()
    @IsOptional()
    observaciones: string;

}