import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";


export class ProductoDto {
   
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsNotEmpty()
    codigo: string;

    @IsNotEmpty()
    unidadMedida: number;

    @IsInt() 
    @Min(1) 
    @IsNotEmpty()
    categoriaId: number;

    @IsOptional()
    subcategoriaId?: number; 

    @IsOptional()
    imagen_url?: string; 
}