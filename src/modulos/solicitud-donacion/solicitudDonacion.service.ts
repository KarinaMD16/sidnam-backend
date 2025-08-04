import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { EmailService } from "../autenticacion/email/email.service";
import { GestionUsuarioService } from "../gestion-usuario/gestion-usuario.service";
import { SolicitudDonacionGateway } from "./solicitudDonacion.gateway";
import { Solicitud_donacion_pendiente } from "./entities/solicitudDonacionPendiente.entity";


@Injectable()
export class  SolicitudDonacionService {

     constructor(

         @InjectRepository(Solicitud_donacion_pendiente)
         private readonly solicitudPendiente: Repository<Solicitud_donacion_pendiente>,

         private readonly solicitudDonacionGateway: SolicitudDonacionGateway,

         private readonly dataSource: DataSource,

         private readonly emailService: EmailService,

         private readonly gestionUsuario: GestionUsuarioService

    ){}

}
