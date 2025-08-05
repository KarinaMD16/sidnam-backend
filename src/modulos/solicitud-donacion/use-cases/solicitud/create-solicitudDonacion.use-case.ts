import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Solicitud_donacion_pendiente } from "../../entities/solicitudDonacionPendiente.entity";
import { SolicitudDonacionGateway } from "../../solicitudDonacion.gateway";
import { CrearSolicitudPendienteDto } from "../../dto/crearSolicitudPendienteDto";

@Injectable()
export class CreateSolicitudDonacionUseCase {

    constructor(
    
        @InjectRepository(Solicitud_donacion_pendiente)
        private readonly solicitudPendiente: Repository<Solicitud_donacion_pendiente>,
        
    
        private readonly solicitudDonacionGateway: SolicitudDonacionGateway,
    
      ) {}

      async crearSolicitudDonacionPendiente(solicitud: CrearSolicitudPendienteDto): Promise<Solicitud_donacion_pendiente> {
      
               const crearSolicitud = this.solicitudPendiente.create({
                      cedula: solicitud.cedula,
                      nombre: solicitud.nombre,
                      apellido1: solicitud.apellido1,
                      apellido2: solicitud.apellido2,
                      telefono: solicitud.telefono,
                      email: solicitud.email,
                      anonimo: solicitud.anonimo,
                      descripcion: solicitud.descripcion,
                      tipoDonacion: solicitud.tipoDonacion,
                      observaciones: solicitud.observaciones,
      
               })
      
               const solicitudPendiente = await this.solicitudPendiente.save(crearSolicitud);
      
               const total = await this.solicitudPendiente.count({where: {estado: 'pendiente'}})
               this.solicitudDonacionGateway.emitSolicitudesPendientesCount(total)
      
               return solicitudPendiente;
          }
}