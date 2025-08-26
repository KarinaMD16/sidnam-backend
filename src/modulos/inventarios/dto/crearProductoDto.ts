import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";


export class ProductoDto {
   
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsNotEmpty()
    codigo: string;

    @IsBoolean()
    @IsOptional()
    archivado: boolean;

    @IsString()
    @IsNotEmpty()
    unidadMedida: string;

    @IsNotEmpty()
    categoriaProducto: number;
}