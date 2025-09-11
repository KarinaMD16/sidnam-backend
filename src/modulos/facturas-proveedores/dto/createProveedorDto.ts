import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProveedor{

    @IsNotEmpty()
    @IsString()
    nombre: string;

    @IsNotEmpty()
    @IsNumber()
    numero_proveedor?: number;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    direccion: string;

    @IsNotEmpty()
    @IsNumber()
    id_area: number

    
}