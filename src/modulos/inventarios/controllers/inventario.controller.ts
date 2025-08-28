import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { InventarioService } from "../services/inventario.service";
import { CategoriaProductoDto } from "../dto/crearCategoriaProductoDto";
import { CreateProductoUseCase } from "../use-cases/producto/create-producto.use-case";
import { ProductoDto } from "../dto/crearProductoDto";
import { GetProductosUseCase } from "../use-cases/producto/get-producto.use-case";
import { UpdateProductoUseCase } from "../use-cases/producto/update-producto.use-case";
import { GetInventarioUseCase } from "../use-cases/inventario/get-inventario.use-case";
import { PatchEditarInventarioDto } from "../dto/actualizarInventarioDto";


@Controller('inventario')
export class InventarioController {

    constructor(

        private readonly inventarioService: InventarioService, 
        private readonly createProductoUseCase: CreateProductoUseCase,
        private readonly getProductoUseCase: GetProductosUseCase,
        private readonly updateProductosUseCase: UpdateProductoUseCase,
        private readonly getInventarioUseCase: GetInventarioUseCase,
    
    ){}

    
    @Post('categorias')
    crearCategoriaProducto(@Body() crearCategoriaProducto: CategoriaProductoDto){
        return this.inventarioService.crearCategoriaProducto(crearCategoriaProducto);
    }

    @Get('categorias')
    getAllCategoriaProducto(){
        return this.inventarioService.getAllCategoriasProductos()
    }

    @Post('productos')
    crearProducto(@Body() Producto: ProductoDto){
        return this.createProductoUseCase.crearProducto(Producto)
    }

    //De acá para arriba esta bien

    @Get('productos')
    findAllProductos() {
        return this.getProductoUseCase.findAllProductos();
    }//Este hay que modificarlo, validar que traiga SOLO los NO archivados, y en el json que lleve solo nombre, codigo y unidadMedida.
  

    @Patch('inventarios/:inventarioId')
    updateInventario(
      @Param('inventarioId', ParseIntPipe) inventarioId: number,
      @Body() dto: PatchEditarInventarioDto,
    ) {
      return this.updateProductosUseCase.updateInventario(inventarioId, dto);
   } //bien, solo cambiarle la ruta, ponerle update/:inventarioId

    
   @Get('categoria/:categoriaId')
   getInventarioPorCategoria(
     @Param('categoriaId', ParseIntPipe) categoriaId: number,
     @Query('page') page?: string,
     @Query('limit') limit?: string,
   ) {
     const p = page ? Number(page) : undefined;
     const l = limit ? Number(limit) : undefined;
     return this.getInventarioUseCase.findAllInventarios(categoriaId, p, l); 
  }//Que solo traiga los archivados = false, simplificar el Json que no lleve mucha info extra.


    @Patch(':inventarioId')
      toggleArchivadoPorInventario(
      @Param('inventarioId', ParseIntPipe) inventarioId: number
    ) {
      return this.updateProductosUseCase.updateArchivadoProducto(inventarioId);
    }//esta bien, solo cambiar la ruta, ponerle handleArchivado/:inventarioId

    @Get('productos/:categoriaId/archivados')
    findProductosArchivadosPorCategoria(
       @Param('categoriaId', ParseIntPipe) categoriaId: number,
       @Query('page') page?: string,
       @Query('limit') limit?: string,
    ) {
      const p = page ? Number(page) : undefined;
      const l = limit ? Number(limit) : undefined;
      return this.getProductoUseCase.findByArchivadoYCategoria(true, categoriaId, p, l);
   }//simplificar el Json que no lleve tanta info extra, cambiar la ruta a archivados/:categoriaId

}