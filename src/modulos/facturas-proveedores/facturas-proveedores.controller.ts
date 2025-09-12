import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { FacturasProveedoresService } from './facturas-proveedores.service';
import { CreateAreaDto } from './dto/createAreaDto';
import { CreateProveedor } from './dto/createProveedorDto';
import { CreateFacturaDto } from './dto/createFacturaDto';
import { ActualizarFacturaDto } from './dto/actualizarFacturaDto';

@Controller('facturas-proveedores')
export class FacturasProveedoresController {


    constructor(
        private readonly facturasproveedoresService: FacturasProveedoresService
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

    @Post('facturas')
    createFactura(@Body() createFactura: CreateFacturaDto){
        return this.facturasproveedoresService.createFactura(createFactura)
    }

    @Get('facturas/proveedor/:idProveedor')
    getFacturasPorProveedor(@Param('idProveedor', ParseIntPipe) idProveedor: number, @Query('page') page?: number, @Query('limit') limit?: number,) {
        return this.facturasproveedoresService.getFacturasPorProveedor(idProveedor, page, limit);
    }

    @Get('facturas/numero/:numeroFactura')
    getFacturaPorNumero(@Param('numeroFactura', ParseIntPipe) numeroFactura: number){
        return this.facturasproveedoresService.getFacturasPorNumero(numeroFactura)
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

   





    


}
