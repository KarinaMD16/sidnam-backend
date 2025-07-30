import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { SolicitudDonacionService } from "./solicitudDonacion.service";
import { CrearSolicitudPendienteDto } from "./dto/crearSolicitudPendienteDto";
import { CrearSolicitudAprobadaDto } from "./dto/crearSolicitudAprobadaDto";
import { TipoDonacionDto } from "./dto/crearTipoDonacionDto";


@Controller('donacion')
export class SolicitudDonacionController {


    constructor (private readonly solicitudDonacionService: SolicitudDonacionService){}

    @Post('crearSolicitudPendiente')
    crearSolicitudPendiente(@Body() solicitudPendiente: CrearSolicitudPendienteDto){
        return this.solicitudDonacionService.crearSolicitudPendiente(solicitudPendiente);
    }

    @Post('crearRegistroDonacion/:idUsuario')
    crearRegistroDonacion(@Body() crearSA: CrearSolicitudAprobadaDto, @Param('idUsuario', ParseIntPipe) idUsuario: number){
        return this.solicitudDonacionService.crearRegistroDonacion(crearSA, idUsuario)
    }

    @Post('tipo-Donacion')
    crearTipoDonacion(@Body() crearTipoDonacion: TipoDonacionDto){
        return this.solicitudDonacionService.crearTipoDonacion(crearTipoDonacion);
    }

    @Get('getTipoDonacion')
    getAllTipoDonacion(){
        return this.solicitudDonacionService.getAllTipoDonacion()
    }

    @Get('getPreviewSolicitudes')
     getPreviewSolicitudes(
         @Query('page', new ParseIntPipe({ optional: true })) page?: number,
         @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    ){
         if (page && limit) {
             return this.solicitudDonacionService.findAllPreviews(page, limit);
         }
         return this.solicitudDonacionService.findAllPreviews();
     }


    @Get('getSolicitudById/:id')
     getSolicitudesById(@Param('id') id: number){
        return this.solicitudDonacionService.findSolicitudById(id);
     } 


    @Get('getEstadoSolicitud')
     getEstadosSolicitd(){
        return this.solicitudDonacionService.getEstadosSolicitud()
    }


    @Get('getFiltroSolicitudes/:id')
    getFiltro(
        @Param('id', ParseIntPipe) id: number,
        @Query('page', new ParseIntPipe({ optional: true })) page?: number,
        @Query('limit', new ParseIntPipe({ optional: true })) limit?: number, 
    ){
         if (page && limit) {
             return this.solicitudDonacionService.getFiltrosEstados(id, page, limit)
        }
         return this.solicitudDonacionService.getFiltrosEstados(id)
    }


    @Patch('updateEstado/:idEstado/:idSoli/:idUsuario')
        updateEstado( @Param('idEstado', ParseIntPipe)  idEstado: number, @Param('idSoli', ParseIntPipe) idSoli: number, @Param('idUsuario', ParseIntPipe) idUsuario: number){
            return this.solicitudDonacionService.updateEstadoDonacion(idEstado, idSoli, idUsuario)
        }

}