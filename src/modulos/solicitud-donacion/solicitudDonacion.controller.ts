import {Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query,} from "@nestjs/common";
import { SolicitudDonacionService } from "./solicitudDonacion.service";
import { CrearSolicitudPendienteDto } from "./dto/crearSolicitudPendienteDto";
import { CreateSolicitudDonacionUseCase } from "./use-cases/solicitud/create-solicitudDonacion.use-case";
import { GetSolicitudesDonacionUseCase } from "./use-cases/solicitud/get-solicitudDonacion.use-case";
import { CreateRegistroDonacionUseCase } from "./use-cases/registro/create-RegistroDonacion.use-case";
import { GetRegistrosDonacionUseCase } from "./use-cases/registro/get-RegistroDonacion.use-case";
import { UpdateRegistroDonacionUseCase } from "./use-cases/registro/update-RegistroDonacion.use-case";


@Controller('donacion')
export class SolicitudDonacionController {

    constructor (
        private readonly solicitudDonacionService: SolicitudDonacionService,
        private readonly createSolicitudDonacionUseCase: CreateSolicitudDonacionUseCase,
        private readonly getSolicitudesDonacionUseCase: GetSolicitudesDonacionUseCase,
        private readonly createRegistroDonacionUseCase: CreateRegistroDonacionUseCase,
        private readonly getRegistrosUseCase: GetRegistrosDonacionUseCase,
        private readonly updateRegistro: UpdateRegistroDonacionUseCase,
    ){}

    @Post('crearSolicitudDonacionPendiente')
    crearSolicitudDonacionPendiente(@Body() solicitudPendiente: CrearSolicitudPendienteDto){
        return this.createSolicitudDonacionUseCase.crearSolicitudDonacionPendiente(solicitudPendiente);
    }


    @Get('getPreviewSolicitudesDonacion')
        getPreviewSolicitudes(
            @Query('page', new ParseIntPipe({ optional: true })) page?: number,
            @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
        ){
            if (page && limit) {
                return this.getSolicitudesDonacionUseCase.findAllPreviews(page, limit);
            }
            return this.getSolicitudesDonacionUseCase.findAllPreviews();
        }
    
        @Get('getSolicitudById/:id')
        getSolicitudesById(@Param('id') id: number){
            return this.getSolicitudesDonacionUseCase.findSolicitudById(id);
        }   


        @Get('getEstadoSolicitudDonacion')
        getEstadosSolicitudDonacion(){
            return this.solicitudDonacionService.getEstadosSolicitudDonacion()
        }


        @Get('getFiltroSolicitudesDonacion/:id')
         getFiltro(
        @Param('id', ParseIntPipe) id: number,
        @Query('page', new ParseIntPipe({ optional: true })) page?: number,
        @Query('limit', new ParseIntPipe({ optional: true })) limit?: number, 
        ){
         if (page && limit) {
             return this.getSolicitudesDonacionUseCase.getFiltrosEstados(id, page, limit)
        }
         return this.getSolicitudesDonacionUseCase.getFiltrosEstados(id)
    }


    @Patch('updateEstado/:idEstado/:idSoli/:idUsuario')
        updateEstado( @Param('idEstado', ParseIntPipe)  idEstado: number, @Param('idSoli', ParseIntPipe) idSoli: number, @Param('idUsuario', ParseIntPipe) idUsuario: number){
            return this.createRegistroDonacionUseCase.updateEstadoSolicitudes(idEstado, idSoli, idUsuario)
        }


    @Get('getPreviewRegistros')
    getPreviewRegistros(
        @Query('page', new ParseIntPipe({ optional: true })) page?: number,
        @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    ){
        if (page && limit) {
            return this.getRegistrosUseCase.findAllPreviewsRegistros(page, limit);
        }
        return this.getRegistrosUseCase.findAllPreviewsRegistros();
    }    

    @Get('getRegistroById/:idRegistro')
    getRegistroById(@Param('idRegistro') idRegistro: number){
        return this.getRegistrosUseCase.getRegistroById(idRegistro);
    }

    
    @Patch('updateEstadoARecibido/:idRegistro/:idUsuario')
    updateEstadoRegistro(@Param('idRegistro', ParseIntPipe) idRegistro: number, @Param('idUsuario', ParseIntPipe) idUsuario: number){
        return this.updateRegistro.updateEstadoARecibido(idRegistro, idUsuario);
    }
}

