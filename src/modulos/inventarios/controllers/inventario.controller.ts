import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { InventarioService } from "../services/inventario.service";
import { CategoriaProductoDto } from "../dto/crearCategoriaProductoDto";
import { CreateProductoUseCase } from "../use-cases/producto/create-producto.use-case";
import { ProductoDto } from "../dto/crearProductoDto";
import { GetProductosUseCase } from "../use-cases/producto/get-producto.use-case";
import { ActualizarProductoDto } from "../dto/actualizarProductoDto";
import { UpdateProductoUseCase } from "../use-cases/producto/update-producto.use-case";
import { DeleteProductoUseCase } from "../use-cases/producto/delete-producto.use-case";
import { GetInventarioUseCase } from "../use-cases/inventario/get-inventario.use-case";
import { CrearInventarioDto } from "../dto/crearInventarioDto";
import { CreateInventarioUseCase } from "../use-cases/inventario/create-inventario.use-case";
import { PatchEditarInventarioDto } from "../dto/actualizarInventarioDto";


@Controller('inventario')
export class InventarioController {

    constructor(

        private readonly inventarioService: InventarioService, 
        private readonly createProductoUseCase: CreateProductoUseCase,
        private readonly getProductoUseCase: GetProductosUseCase,
        private readonly updateProductosUseCase: UpdateProductoUseCase,
        private readonly deleteProductosUseCase: DeleteProductoUseCase,
        private readonly getInventarioUseCase: GetInventarioUseCase,
        private readonly createInventarioUseCase: CreateInventarioUseCase,
    
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

    @Get('productos')
    findAllProductos() {
        return this.getProductoUseCase.findAllProductos();
    }

    @Patch('productos/:idProducto')
    updateProducto(@Param('idProducto', ParseIntPipe) idProducto: number, @Body() dto: ActualizarProductoDto) {
        return this.updateProductosUseCase.updateProducto(idProducto, dto);
    }

    @Patch('inventarios/:inventarioId')
    updateInventario(
      @Param('inventarioId', ParseIntPipe) inventarioId: number,
      @Body() dto: PatchEditarInventarioDto,
    ) {
      return this.updateProductosUseCase.updateInventario(inventarioId, dto);
   } 

    @Delete('productos/:idProducto')
        async removeProducto(@Param('idProducto', ParseIntPipe) id: number){
            await this.deleteProductosUseCase.deleteProducto(id);
    }

    @Get('productos/:categoriaId')
    findByCategoriaId(
        @Param('categoriaId', ParseIntPipe) categoriaId: number,
        @Query('page', new ParseIntPipe({optional: true})) page?: number,
        @Query('limit', new ParseIntPipe({optional: true})) limit?: number,
    ) {
        if(page && limit){
            return this.getProductoUseCase.findByCategoriaId(categoriaId, page, limit);
        }
        return this.getProductoUseCase.findByCategoriaId(categoriaId);
   }

   
   @Get('categoria/:categoriaId')
   getInventarioPorCategoria(
     @Param('categoriaId', ParseIntPipe) categoriaId: number,
     @Query('page') page?: string,
     @Query('limit') limit?: string,
   ) {
     const p = page ? Number(page) : undefined;
     const l = limit ? Number(limit) : undefined;
     return this.getInventarioUseCase.findAllInventarios(categoriaId, p, l); 
  }



    @Post('crearInventario')
       crearInventario(@Body() dto: CrearInventarioDto) {
       return this.createInventarioUseCase.crearInventario(dto);
    }


    @Patch(':inventarioId')
      toggleArchivadoPorInventario(
      @Param('inventarioId', ParseIntPipe) inventarioId: number
    ) {
      return this.updateProductosUseCase.updateArchivadoProducto(inventarioId);
    }

    @Get('productos/:categoriaId/archivados')
    findProductosArchivadosPorCategoria(
       @Param('categoriaId', ParseIntPipe) categoriaId: number,
       @Query('page') page?: string,
       @Query('limit') limit?: string,
    ) {
      const p = page ? Number(page) : undefined;
      const l = limit ? Number(limit) : undefined;
      return this.getProductoUseCase.findByArchivadoYCategoria(true, categoriaId, p, l);
   }

    @Get('getProductosActivos') 
    findProductosActivos(
      @Query('page') page?: string,
      @Query('limit') limit?: string,
    ) {
      const p = page ? Number(page) : undefined;
      const l = limit ? Number(limit) : undefined;
      return this.getProductoUseCase.findByArchivado(false, p, l);
    }

}