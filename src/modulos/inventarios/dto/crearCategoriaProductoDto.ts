import {IsNotEmpty, IsString } from "class-validator";
import { CategoriasPrincipalesProductos } from "src/common/enums/categoriasPrincipalesProductos.enum";


export class CategoriaProductoDto{

    @IsString()
    @IsNotEmpty()
    nombre: CategoriasPrincipalesProductos;

    @IsString()
    @IsNotEmpty()
    icono: string;

    @IsString()
    @IsNotEmpty()
    descripcion: string;
    
}