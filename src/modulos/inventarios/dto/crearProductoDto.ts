import { IsNotEmpty, IsString } from "class-validator";


export class ProductoDto {
   
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsNotEmpty()
    codigo: string;

    @IsString()
    @IsNotEmpty()
    unidadMedida: string;

    @IsNotEmpty()
    categoriaProducto: number;
}