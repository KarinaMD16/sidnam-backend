import { Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { InventarioService } from "../services/inventario.service";
import { CategoriaProductoDto } from "../dto/crearCategoriaProductoDto";
import { CreateProductoUseCase } from "../use-cases/producto/create-producto.use-case";
import { ProductoDto } from "../dto/crearProductoDto";
import { GetProductosUseCase } from "../use-cases/producto/get-producto.use-case";
import { UpdateProductoUseCase } from "../use-cases/producto/update-producto.use-case";
import { GetInventarioUseCase } from "../use-cases/inventario/get-inventario.use-case";
import { PatchEditarInventarioDto } from "../dto/actualizarInventarioDto";
import { CrearEntradaLoteDto } from "../dto/crearEntradaDto";
import { CreateEntradaUseCase } from "../use-cases/entrada/create-entrada.use-case";


@Controller('inventario')
export class InventarioController {

    constructor(

        private readonly inventarioService: InventarioService, 
        private readonly createProductoUseCase: CreateProductoUseCase,
        private readonly getProductoUseCase: GetProductosUseCase,
        private readonly updateProductosUseCase: UpdateProductoUseCase,
        private readonly getInventarioUseCase: GetInventarioUseCase,
        private readonly createEntradaUseCase: CreateEntradaUseCase
    
    ){}

    
    @Post('categorias')
    crearCategoriaProducto(@Body() crearCategoriaProducto: CategoriaProductoDto){
        return this.inventarioService.crearCategoriaProducto(crearCategoriaProducto);
    }

    @Get('categorias')
    getAllCategoriaProducto(){
        return this.inventarioService.getAllCategoriasProductos()
    }

    @Get()
  async getCategorias() {
    return this.inventarioService.getCategorias();
  }

    @Post('productos')
    crearProducto(@Body() Producto: ProductoDto){
        return this.createProductoUseCase.crearProducto(Producto)
    }

    
    @Get('productos')
    findAllProductos() {
        return this.getProductoUseCase.findAllProductos();
    }
  

    @Patch('update/:inventarioId')
    updateInventario(
      @Param('inventarioId', ParseIntPipe) inventarioId: number,
      @Body() dto: PatchEditarInventarioDto,
    ) {
      return this.updateProductosUseCase.updateInventario(inventarioId, dto);
   } 

    
   @Get('categoria/:categoriaId')
   getInventarioPorCategoria(
     @Param('categoriaId', ParseIntPipe) categoriaId: number,
     @Query('page') page?: number,
     @Query('limit') limit?: number,
   ) {
     const p = page ? Number(page) : undefined;
     const l = limit ? Number(limit) : undefined;
     return this.getInventarioUseCase.findAllInventarios(categoriaId, p, l); 
  }


    @Patch('handleArchivado/:inventarioId')
      toggleArchivadoPorInventario(
      @Param('inventarioId', ParseIntPipe) inventarioId: number
    ) {
      return this.updateProductosUseCase.updateArchivadoProducto(inventarioId);
    }

    @Get('archivados/:categoriaId')
    findProductosArchivadosPorCategoria(
      @Param('categoriaId', ParseIntPipe) categoriaId: number,
      @Query('page',  new DefaultValuePipe(1), ParseIntPipe) page: number,   
      @Query('limit', new DefaultValuePipe(0), ParseIntPipe) limit: number, 
    ) {
     return this.getProductoUseCase.findByArchivadoYCategoria(true, categoriaId, page, limit);
   }

   @Post('entradas/lote')
   crearEntradaLote(@Body() dto: CrearEntradaLoteDto) {
      return this.createEntradaUseCase.crearEntradasLote(dto);
   }

}