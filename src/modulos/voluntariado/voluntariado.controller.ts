import { Body, Controller, Get, Post } from '@nestjs/common';
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
    
    

}
