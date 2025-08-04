import {Body, Controller, Post,} from "@nestjs/common";
import { SolicitudDonacionService } from "./solicitudDonacion.service";
import { CrearSolicitudPendienteDto } from "./dto/crearSolicitudPendienteDto";
import { CreateSolicitudDonacionUseCase } from "./use-cases/solicitud/create-solicitudDonacion.use-case";


@Controller('donacion')
export class SolicitudDonacionController {

    constructor (
        private readonly solicitudDonacionService: SolicitudDonacionService,
        private readonly createSolicitudDonacionUseCase: CreateSolicitudDonacionUseCase
    ){}

    @Post('crearSolicitudDonacionPendiente')
    crearSolicitudDonacionPendiente(@Body() solicitudPendiente: CrearSolicitudPendienteDto){
        return this.createSolicitudDonacionUseCase.crearSolicitudDonacionPendiente(solicitudPendiente);
    }
}

