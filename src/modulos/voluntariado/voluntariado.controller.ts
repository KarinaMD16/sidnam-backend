import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { VoluntariadoService } from './voluntariado.service';
import { CrearSolicitudPendienteDto } from './dto/crearSolicitudPendienteDto';
import { SolicitudPendiente } from './entities/solicitudPendiente.entity';
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

    @Get('getTodasSolicitudes')
    getAllSolicitudes(){
        return this.voluntariadoService.getAllSolicitudes()
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

    
}
