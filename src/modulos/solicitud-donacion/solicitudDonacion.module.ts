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



@Module({
    imports: [
        TypeOrmModule.forFeature([RegistroDonacion, Solicitud_donacion_pendiente, Donador,]),
        AutenticacionModule,
        GestionUsuarioModule,
    ],
    providers: [SolicitudDonacionService, SolicitudDonacionGateway, CreateSolicitudDonacionUseCase],
    controllers: [SolicitudDonacionController],
    exports: [SolicitudDonacionService],
})
export class SolicitudDonacionModule {}