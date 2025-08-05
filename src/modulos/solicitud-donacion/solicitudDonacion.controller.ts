import {Body, Controller, Get, Param, ParseIntPipe, Post, Query,} from "@nestjs/common";
import { SolicitudDonacionService } from "./solicitudDonacion.service";
import { CrearSolicitudPendienteDto } from "./dto/crearSolicitudPendienteDto";
import { CreateSolicitudDonacionUseCase } from "./use-cases/solicitud/create-solicitudDonacion.use-case";
import { GetSolicitudesDonacionUseCase } from "./use-cases/solicitud/get-solicitudDonacion.use-case";


@Controller('donacion')
export class SolicitudDonacionController {

    constructor (
        private readonly solicitudDonacionService: SolicitudDonacionService,
        private readonly createSolicitudDonacionUseCase: CreateSolicitudDonacionUseCase,
        private readonly getSolicitudesDonacionUseCase: GetSolicitudesDonacionUseCase
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
}

