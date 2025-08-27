import { Expose, Type } from "class-transformer";
import { ProductoPreviewDto } from "./productoDto";


export class InventarioPreviewDto{

    @Expose()
    id: number;

    @Expose()
    stock: number;

    @Expose()
    @Type(() => ProductoPreviewDto)
    producto: ProductoPreviewDto;
}