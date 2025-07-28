import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { VoluntariadoService } from './voluntariado.service';
import { CrearSolicitudPendienteDto } from './dto/crearSolicitudPendienteDto';
import { TipoVoluntarioDto } from './dto/crearTipoVoluntarioDto';

@Controller('voluntariado')
export class VoluntariadoController {


    constructor(private readonly voluntariadoService: VoluntariadoService){}

    @Post('crearSolicitudPendiente')
    crearSolicitudPendiente(@Body() SolicitudPendiente: CrearSolicitudPendienteDto){
        return this.voluntariadoService.crearSolicitudPendiente(SolicitudPendiente)
    }

    @Post('tipo-Voluntariado')
    crearTipoVoluntario(@Body() crearTipoVoluntario: TipoVoluntarioDto){
        return this.voluntariadoService.crearTipoVoluntario(crearTipoVoluntario);
    }

    @Get('getTipoVoluntario')
    getAllTipoVoluntario(){
        return this.voluntariadoService.getAllTipoVoluntario()
    }

    @Get('getPreviewSolicitudes')
    getPreviewSolicitudes(
        @Query('page', new ParseIntPipe({ optional: true })) page?: number,
        @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    ){
        if (page && limit) {
            return this.voluntariadoService.findAllPreviews(page, limit);
        }
        return this.voluntariadoService.findAllPreviews();
    }

    @Get('getSolicitudById/:id')
    getSolicitudesById(@Param('id') id: number){
        return this.voluntariadoService.findSolicitudById(id);
    }   

    @Get('getEstadoSolicitud')
    getEstadosSolicitd(){
        return this.voluntariadoService.getEstadosSolicitud()
    }

    @Get('getFiltroSolicitudes/:id')
    getFiltro(
        @Param('id', ParseIntPipe) id: number,
        @Query('page', new ParseIntPipe({ optional: true })) page?: number,
        @Query('limit', new ParseIntPipe({ optional: true })) limit?: number, 
    ){
         if (page && limit) {
             return this.voluntariadoService.getFiltosEstados(id, page, limit)
        }
         return this.voluntariadoService.getFiltosEstados(id)
    }

    @Patch('updateEstado/:idEstado/:idSoli/:idUsuario')
    updateEstado( @Param('idEstado', ParseIntPipe)  idEstado: number, @Param('idSoli', ParseIntPipe) idSoli: number, @Param('idUsuario', ParseIntPipe) idUsuario: number){
        return this.voluntariadoService.updateEstadoSolicitudes(idEstado, idSoli, idUsuario)
    }

}
