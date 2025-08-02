import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RegistroDonacion } from "./entities/registroDonacion.entity";
import { Solicitud_pendiente } from "./entities/solicitudPendiente.entity";
import { SolicitudDonacion } from "./entities/solicitudDonacion.entity";
import { Tipo_donacion } from "./entities/tipoDonacion.entity";
import { SolicitudDonacionService } from "./solicitudDonacion.service";
import { SolicitudDonacionController } from "./solicitudDonacion.controller";
import { AutenticacionModule } from "../autenticacion/autenticacion.module";
import { SolicitudDonacionGateway } from "./solicitudDonacion.gateway";
import { GestionUsuarioModule } from "../gestion-usuario/gestion-usuario.module";



@Module({
    imports: [
        TypeOrmModule.forFeature([RegistroDonacion, Solicitud_pendiente, SolicitudDonacion, Tipo_donacion]),
        AutenticacionModule,
        GestionUsuarioModule,
    ],
    providers: [SolicitudDonacionService, SolicitudDonacionGateway],
    controllers: [SolicitudDonacionController],
    exports: [SolicitudDonacionService],
})
export class SolicitudDonacionModule {}