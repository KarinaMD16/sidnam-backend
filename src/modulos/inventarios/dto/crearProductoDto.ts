import { IsNotEmpty, IsString } from "class-validator";


export class ProductoDto {
   
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsNotEmpty()
    codigo: string;

    @IsNotEmpty()
    unidadMedida: number;

    @IsNotEmpty()
    categoriaProducto: number;
}