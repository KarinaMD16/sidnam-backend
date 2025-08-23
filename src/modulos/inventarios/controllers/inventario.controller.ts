import { Body, Controller, Get, Post } from "@nestjs/common";
import { InventarioService } from "../services/inventario.service";
import { CategoriaProductoDto } from "../dto/crearCategoriaProductoDto";


@Controller('inventario')
export class InventarioController {

    constructor(

        private readonly inventarioService: InventarioService, 
    ){}

    
    @Post('categorias/productos')
    crearCategoriaProducto(@Body() crearCategoriaProducto: CategoriaProductoDto){
        return this.inventarioService.crearCategoriaProducto(crearCategoriaProducto);
    }

    @Get('categorias/productos')
    getAllCategoriaProducto(){
        return this.inventarioService.getAllCategoriasProductos()
    }
}