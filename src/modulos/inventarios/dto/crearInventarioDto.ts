import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, Min } from "class-validator";


export class CrearInventarioDto{
   
    @Type(() => Number)
    @IsInt({ message: 'El stock debe ser un entero' })
    @Min(0, { message: 'El stock no puede ser negativo' })
    @IsNotEmpty()
    stock: number;

    @Type(() => Number)
    @IsInt({ message: 'El productoId debe ser un entero' })
    @Min(1, { message: 'El productoId debe ser mayor a 0' })
    @IsNotEmpty()
    productoId: number;
}