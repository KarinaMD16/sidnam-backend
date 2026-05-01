import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import { FacturasProveedoresService } from './facturas-proveedores.service';
import { CreateAreaDto } from './dto/createAreaDto';
import { CreateProveedor } from './dto/createProveedorDto';
import { CreateFacturaDto } from './dto/createFacturaDto';
import { ActualizarFacturaDto } from './dto/actualizarFacturaDto';
import { ReporteFacturaService } from './reporte/reporteFacturas.service';
import { Response as ExpressResponse } from 'express';
import { ApiOkResponse, ApiOperation, ApiProduces, ApiQuery } from '@nestjs/swagger';
import { UpdateProveedorDto } from './dto/updateProveedorDto';
import { AuthGuard } from '../autenticacion/guard/auth.guard';



UseGuards(AuthGuard)
@Controller('facturas-proveedores')
export class FacturasProveedoresController {


    constructor(
        private readonly facturasproveedoresService: FacturasProveedoresService,
        private readonly reporteFacturaService: ReporteFacturaService,
    ){}

    @Post('areas')
    createAreas(@Body() createArea: CreateAreaDto){
        return this.facturasproveedoresService.createArea(createArea)
    }

    @Get('areas')
    getAreas(){
        return this.facturasproveedoresService.getAreas()
    }

    @Get('areas/id/:id_area')
    getAreasById(@Param('id_area', ParseIntPipe) id_area: number){
        return this.facturasproveedoresService.getAreaByID(id_area)
    }

    @Get('areas/activas')
    getAreasActivas(@Query('page') page?: number, @Query('limit') limit?: number){
        return this.facturasproveedoresService.getAreasActivas(page, limit)
    }

    @Post('proveedores')
    createProveedores(@Body() createProveedor: CreateProveedor){
        return this.facturasproveedoresService.createProveedor(createProveedor)
    }

    @Get('proveedores')
    getProveedores(){
        return this.facturasproveedoresService.getProveedores()
    }

    @Get('proveedores/filtrar-nombre')
    getProveedoresPorNombre(@Query('filtro') filtro: string) {
        return this.facturasproveedoresService.buscarProveedoresPorNombre(filtro);
    }

    @Get('proveedores/area/:idArea')
    getProveedoresPorArea(@Param('idArea', ParseIntPipe) idArea: number){
        return this.facturasproveedoresService.getProveedoresPorArea(idArea)
    }

    @Get('proveedores/activos')
    getProveedoresActivos(){
        return this.facturasproveedoresService.getProveedoresActivos()
    }

    @Post('facturas')
    createFactura(@Body() createFactura: CreateFacturaDto){
        return this.facturasproveedoresService.createFactura(createFactura)
    }

    @Get('facturas/proveedor/:idProveedor')
    getFacturasPorProveedor(@Param('idProveedor', ParseIntPipe) idProveedor: number, @Query('page') page?: number, @Query('limit') limit?: number,) {
        return this.facturasproveedoresService.getFacturasPorProveedor(idProveedor, page, limit);
    }

    @Get('facturas/numero/:numeroFactura')
    getFacturaPorNumero(@Param('numeroFactura') numeroFactura: string) {
    return this.facturasproveedoresService.getFacturasPorNumero(numeroFactura);
    }

    @Get('facturas/estados')
    getEstadosFacturas(){
        return this.facturasproveedoresService.getEstadosFacturas()
    }

    @Get('facturas/estados/:idEstadoFactura')
    getFacturasPorEstado(@Param('idEstadoFactura', ParseIntPipe) idEstadoFactura: number, @Query('page') page?: number, @Query('limit') limit?: number,){
        return this.facturasproveedoresService.getFacturasPorEstado(idEstadoFactura, page, limit)
    }

    @Patch('facturas/:idFactura')
    actualizarFactura(@Param('idFactura', ParseIntPipe) idFactura: number, @Body() actualizarFactura: ActualizarFacturaDto){
        return this.facturasproveedoresService.actualizarFactura(idFactura, actualizarFactura)
    }

    @Patch('facturas/estado/:id')
    async actualizarEstado(@Param('id', ParseIntPipe) id: number) {
       return this.facturasproveedoresService.actualizarEstadoFactura(id);
    }

    @Patch('proveedor/handleArchivado/:id')
    async handleArchivado(@Param('id', ParseIntPipe) id: number) {
       return this.facturasproveedoresService.toggleArchivadoProveedor(id);
    }

    @Get('proveedores/archivados/:id')
    getArchivados(@Param('id', ParseIntPipe) id: number) {
       return this.facturasproveedoresService.getProveedoresArchivados(id);
    }

    @Get('reportes/pdf')
    @ApiOperation({ summary: 'Descargar PDF de facturas por mes/año y estado' })
    @ApiProduces('application/pdf')
    @ApiOkResponse({
      description: 'Archivo PDF',
      content: { 'application/pdf': { schema: { type: 'string', format: 'binary' } } },
    })
    @ApiQuery({ name: 'mes', required: true, type: Number, description: '1-12' })
    @ApiQuery({ name: 'anio', required: true, type: Number })
    @ApiQuery({ name: 'estado', required: true, type: Number, description: '0 = todas, 1 = pagadas, 2 = pendientes' })
     async reporteFacturasPdf(@Query('anio') anio: number, @Query('mes') mes: number, @Query('estado') estado: number, @Res() res: ExpressResponse) {
      await this.reporteFacturaService.generarReporteFacturas(Number(anio), Number(mes), Number(estado), res);
    }


  @Patch('proveedores/:idProveedor')
  @ApiOkResponse({ description: 'Proveedor actualizado correctamente' })
   async updateProveedor(@Param('idProveedor', ParseIntPipe) id: number,@Body() dto: UpdateProveedorDto) {
     return this.facturasproveedoresService.updateProveedor(id, dto);
  }

    @Get('facturas')
    getFacturas(@Query('page') page?: number, @Query('limit') limit?: number, @Query('estado', ParseIntPipe) estado?: number) {
        return this.facturasproveedoresService.getFacturas(page, limit, estado);
    }
}


