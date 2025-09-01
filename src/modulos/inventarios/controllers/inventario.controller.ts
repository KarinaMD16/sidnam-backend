import { Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Patch, Post, Query, Res } from "@nestjs/common";
import { Response as ExpressResponse } from 'express';
import { InventarioService } from "../services/inventario.service";
import { CategoriaProductoDto } from "../dto/crearCategoriaProductoDto";
import { CreateProductoUseCase } from "../use-cases/producto/create-producto.use-case";
import { ProductoDto } from "../dto/crearProductoDto";
import { GetProductosUseCase } from "../use-cases/producto/get-producto.use-case";
import { UpdateProductoUseCase } from "../use-cases/producto/update-producto.use-case";
import { GetInventarioUseCase } from "../use-cases/inventario/get-inventario.use-case";
import { PatchEditarInventarioDto } from "../dto/actualizarInventarioDto";
import { CrearEntradaDto } from "../dto/crearEntradaDto";
import { CreateEntradaUseCase } from "../use-cases/entrada/create-entrada.use-case";
import { GetEntradaUseCase } from "../use-cases/entrada/get-entrada.use-case";
import { CrearSalidaDto } from "../dto/crearSalidaDto";
import { CreateSalidaUseCase } from "../use-cases/salida/create-salida.use-case";
import { GetSalidaUseCase } from "../use-cases/salida/get-salida.use-case";
import { ReportesInventarioService } from "../services/reporteInventario.service";
import { ReporteMovimientosDto } from "../dto/reporteMovimientosDto";
import { ApiOkResponse, ApiOperation, ApiProduces, ApiQuery } from "@nestjs/swagger";
import { CreateCategoriaDto } from "../dto/createCategoriaDto";


@Controller('inventario')
export class InventarioController {

    constructor(

        private readonly inventarioService: InventarioService, 
        private readonly createProductoUseCase: CreateProductoUseCase,
        private readonly getProductoUseCase: GetProductosUseCase,
        private readonly updateProductosUseCase: UpdateProductoUseCase,
        private readonly getInventarioUseCase: GetInventarioUseCase,
        private readonly createEntradaUseCase: CreateEntradaUseCase,
        private readonly getEntradaUseCase: GetEntradaUseCase,
        private readonly createSalidaUseCase: CreateSalidaUseCase,
        private readonly getSalidasUsecase: GetSalidaUseCase,
        private readonly reporteInventarioService: ReportesInventarioService,
    
    ){}

    
    @Get()
  async getCategorias() {
    return this.inventarioService.getCategorias();
  }

  @Post('tipo-categoria/categoria/:idCategoriaProducto')
      async createCategoriaProducto(@Param('idCategoria', ParseIntPipe) idCategoria: number,@Body() createCategoriaDto: CreateCategoriaDto,) {
      return this.inventarioService.crearCategoria(idCategoria, createCategoriaDto);
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

    @Get('categoria/:categoriaId/all')
    getInventariosPorCategoriaSinPaginacion(
       @Param('categoriaId', ParseIntPipe) categoriaId: number,
     ) {
        return this.getInventarioUseCase.findAllByCategoriaSinPaginacion(categoriaId);
     }

     //Entradas
     @Post('entrada')
     crearEntradas(@Body() dto: CrearEntradaDto) {
        return this.createEntradaUseCase.crearEntradas(dto);
     }

     @Get('entradas/:anio/:mes/:categoriaId')
     getEntradasPorMes(
     @Param('anio', ParseIntPipe) anio: number,
     @Param('mes',  ParseIntPipe) mes: number,
     @Param('categoriaId', ParseIntPipe) categoriaId: number,        
     @Query('page',  new DefaultValuePipe(1), ParseIntPipe) page?: number,
     @Query('limit', new DefaultValuePipe(0), ParseIntPipe) limit?: number,
    ) {
       return this.getEntradaUseCase.getEntradasPorMes(mes, anio, categoriaId, page, limit);  
    }


     //Salidas
     @Post('salidas') 
     crearSalidas(@Body() dto: CrearSalidaDto) {
        return this.createSalidaUseCase.crearSalidas(dto);
     }

     @Get('salidas/:anio/:mes')
     getSalidasPorMes(
        @Param('anio', ParseIntPipe) anio: number,
        @Param('mes',  ParseIntPipe) mes: number,
        @Query('page',  new DefaultValuePipe(1), ParseIntPipe) page?: number,   
        @Query('limit', new DefaultValuePipe(0), ParseIntPipe) limit?: number, 
       ) {
        return this.getSalidasUsecase.getSalidasPorMes(mes, anio, page, limit);
     }


     //reporte de entradas/salidas

     @Get('reportes/entradas/pdf')
     @ApiOperation({ summary: 'Descargar PDF de entradas por categoría/mes/año' })
     @ApiProduces('application/pdf')
     @ApiOkResponse({
     description: 'Archivo PDF',
     content: { 'application/pdf': { schema: { type: 'string', format: 'binary' } } },
    })
    @ApiQuery({ name: 'categoriaId', required: true, type: Number })
    @ApiQuery({ name: 'mes', required: true, type: Number, description: '1-12' })
    @ApiQuery({ name: 'anio', required: true, type: Number })
      async reporteEntradasPdf(
      @Query() q: ReporteMovimientosDto,
      @Res() res: ExpressResponse
      ) {
         await this.reporteInventarioService.generarReporteEntradas(q, res);
      }

     @Get('reportes/salidas/pdf')
     @ApiOperation({ summary: 'Descargar PDF de salidas por categoría/mes/año' })
     @ApiProduces('application/pdf')
     @ApiOkResponse({
     description: 'Archivo PDF',
     content: { 'application/pdf': { schema: { type: 'string', format: 'binary' } } },
     })
     @ApiQuery({ name: 'categoriaId', required: true, type: Number })
     @ApiQuery({ name: 'mes', required: true, type: Number, description: '1-12' })
     @ApiQuery({ name: 'anio', required: true, type: Number })
       async reporteSalidasPdf(
       @Query() q: ReporteMovimientosDto,
       @Res() res: ExpressResponse
       ) {
         await this.reporteInventarioService.generarReporteSalidas(q, res);
       }
}