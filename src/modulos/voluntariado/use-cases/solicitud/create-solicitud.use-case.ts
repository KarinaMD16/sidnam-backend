// use-cases/update-expediente.use-case.ts
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Not, Repository } from 'typeorm';
import { SolicitudPendiente } from '../../entities/solicitudPendiente.entity';
import { Tipo_voluntariado } from '../../entities/tipoVoluntariado.entity';
import { VoluntariadoGateway } from '../../voluntariado.gateway';
import { CrearSolicitudPendienteDto } from '../../dto/crearSolicitudPendienteDto';

@Injectable()
export class CreateSolicitudUseCase {
  constructor(

    @InjectRepository(SolicitudPendiente)
    private readonly solicitudPendiente: Repository<SolicitudPendiente>,
    
    @InjectRepository(Tipo_voluntariado)
    private readonly tipoVoluntariado: Repository<Tipo_voluntariado>,

    private readonly voluntariadoGateway: VoluntariadoGateway,

  ) {}

   async crearSolicitudPendiente(solicitud: CrearSolicitudPendienteDto): Promise<SolicitudPendiente>{
   
           const voluntariado = await this.tipoVoluntariado.findOne({
               where: {id: solicitud.tipoVoluntariado},
           });
   
           if(!voluntariado){
               throw new NotFoundException(`Tipo de voluntariado con id ${solicitud.tipoVoluntariado} no encontrado`);
           }
   
           const crearSolicitud = this.solicitudPendiente.create({
               cedula: solicitud.cedula,
               nombre: solicitud.nombre,
               apellido1: solicitud.apellido1,
               apellido2: solicitud.apellido2,
               email: solicitud.email,
               telefono: solicitud.telefono,
               ocupacion: solicitud.ocupacion,
               direccion: solicitud.direccion,
               sexo: solicitud.sexo,
               experienciaLaboral: solicitud.experienciaLaboral,
               tipoVoluntariado: solicitud.tipoVoluntariado, 
               cantidadHoras: solicitud.cantidadHoras,
               contactosEmergencia: solicitud.contactosEmergencia ?? [],
               horarios: solicitud.horarios ?? [],
               observaciones: solicitud.observaciones
           })
   
            const solicitudPentiende = await this.solicitudPendiente.save(crearSolicitud);
   
            const total = await this.solicitudPendiente.count({where: {estado: 'pendiente'}})
            this.voluntariadoGateway.emitSolicitudesPendientesCount(total)
   
            return solicitudPentiende
    }
}
