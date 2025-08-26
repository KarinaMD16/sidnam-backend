import { Expose, Type } from "class-transformer";
import { CategoriaDto } from "./categoriaDto";


export class ProductoPreviewDto{

    @Expose()
    id: number;

    @Expose()
    nombre: string;

    @Expose()
    codigo: string;

    @Expose()
    archivado: boolean;

    @Expose()
    unidadMedida: string;

    @Expose()
    @Type(() => CategoriaDto)
    categoria: CategoriaDto;
}