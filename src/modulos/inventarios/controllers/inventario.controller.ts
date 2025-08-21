import { Controller, Get } from "@nestjs/common";
import { InventarioService } from "../services/inventario.service";


@Controller('inventario')
export class InventarioController {

    constructor(

        private readonly inventarioService: InventarioService, 
    ){}

    @Get('categorias/productos')
    getCategoriaProductos(){
        return this.inventarioService.getCategoriasProductos()
    }
}