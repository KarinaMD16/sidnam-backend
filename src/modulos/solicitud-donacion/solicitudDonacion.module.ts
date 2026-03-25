import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RegistroDonacion } from "./entities/registroDonacion.entity";
import { SolicitudDonacionService } from "./solicitudDonacion.service";
import { SolicitudDonacionController } from "./solicitudDonacion.controller";
import { AutenticacionModule } from "../autenticacion/autenticacion.module";
import { SolicitudDonacionGateway } from "./solicitudDonacion.gateway";
import { GestionUsuarioModule } from "../gestion-usuario/gestion-usuario.module";
import { Solicitud_donacion_pendiente } from "./entities/solicitudDonacionPendiente.entity";
import { Donador } from "./entities/donador.entity";
import { CreateSolicitudDonacionUseCase } from "./use-cases/solicitud/create-solicitudDonacion.use-case";
import { GetSolicitudesDonacionUseCase } from "./use-cases/solicitud/get-solicitudDonacion.use-case";
import { CreateRegistroDonacionUseCase } from "./use-cases/registro/create-RegistroDonacion.use-case";
import { GetRegistrosDonacionUseCase } from "./use-cases/registro/get-RegistroDonacion.use-case";
import { UpdateRegistroDonacionUseCase } from "./use-cases/registro/update-RegistroDonacion.use-case";
import { ReporteDonacionesService } from "./reporteDonacion.service";
import { PdfHtmlService } from "src/common/services/pdf-html.service";
import { VoluntariadoModule } from "../voluntariado/voluntariado.module";



@Module({
    imports: [
        TypeOrmModule.forFeature([RegistroDonacion, Solicitud_donacion_pendiente, Donador,]),
        AutenticacionModule,
        GestionUsuarioModule,
        VoluntariadoModule
    ],
    providers: [SolicitudDonacionService, SolicitudDonacionGateway, CreateSolicitudDonacionUseCase, GetSolicitudesDonacionUseCase, CreateRegistroDonacionUseCase, GetRegistrosDonacionUseCase, UpdateRegistroDonacionUseCase, ReporteDonacionesService, PdfHtmlService],
    controllers: [SolicitudDonacionController],
    exports: [SolicitudDonacionService],
})
export class SolicitudDonacionModule {}