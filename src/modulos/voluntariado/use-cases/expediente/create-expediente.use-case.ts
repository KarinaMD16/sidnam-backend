// use-cases/update-expediente.use-case.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SolicitudAprobada } from '../../entities/solicitudAprobada.entity';
import { DataSource, Not, Repository } from 'typeorm';
import { SolicitudPendiente } from '../../entities/solicitudPendiente.entity';
import { Tipo_voluntariado } from '../../entities/tipoVoluntariado.entity';
import { Voluntario } from '../../entities/voluntariado.entity';
import { CrearExpediente } from '../../dto/crearExpedienteDto';
import { GestionUsuarioService } from 'src/modulos/gestion-usuario/services/gestion-usuario.service';
import { EstadoSolicitud } from 'src/common/enums/estadosSolicitudes.enum';
import { EstadoMap } from 'src/common/constants/estado.constant';
import { EmailService } from 'src/modulos/autenticacion/email/email.service';
import { VoluntariadoGateway } from '../../voluntariado.gateway';
import { Usuario } from 'src/modulos/gestion-usuario/entities/usuario.entity';
import { getTiposVoluntario } from 'src/common/enums/tipoVoluntarios.enum';

@Injectable()
export class CreateExpedienteUseCase {
  constructor(
    @InjectRepository(SolicitudAprobada)
    private readonly solicitudAprobada: Repository<SolicitudAprobada>,

    @InjectRepository(SolicitudPendiente)
    private readonly solicitudPendiente: Repository<SolicitudPendiente>,
    
    @InjectRepository(Tipo_voluntariado)
    private readonly tipoVoluntariado: Repository<Tipo_voluntariado>,
            
    @InjectRepository(Voluntario)
    private readonly voluntarioRepository: Repository<Voluntario>,

    private readonly voluntariadoGateway: VoluntariadoGateway,
   
    private readonly dataSource: DataSource,
   
    private readonly emailService: EmailService,
   
    private readonly gestionUsuario: GestionUsuarioService

  ) {}

   async crearExpediente(solicitud: CrearExpediente, idUsuario: number): Promise<{message: string}>{
   
           const voluntariado = await this.tipoVoluntariado.findOne({
               where: {id: solicitud.tipoVoluntariado},
           });
   
           const expediente = await this.solicitudAprobada.findOne({
               where: {
                   estado: 'Activo',
                   voluntario: {
                       cedula: solicitud.cedula
                   }
               },
               relations: ['voluntario']
           });
   
          if (expediente) {
               throw new BadRequestException('No puedes registrar este expediente, hay expedientes activos')
          }
   
   
           if(!voluntariado){
               throw new NotFoundException(`Tipo de voluntariado con id ${solicitud.tipoVoluntariado} no encontrado`);
           }
   
           const usuario = await this.gestionUsuario.findOneById(idUsuario)
   
           await this.dataSource.transaction(async manager => {
   
               let voluntario = await this.voluntarioRepository.findOne({
                   where: { cedula: solicitud.cedula },
                   relations: ['contactosEmergencia'],
               });
   
       
               if (!solicitud.contactosEmergencia) {
                   throw new BadRequestException('Los contactos de emergencia son requeridos');
               }
   
              if(!solicitud.horarios){
                   throw new BadRequestException('Los horarios son requeridos')
              }
   
              if(voluntario){
                   await manager.delete('Contacto_emergencia', { voluntario: voluntario.id });
   
                   const nuevosContactos = solicitud.contactosEmergencia.map(c => ({
                       nombre: c.nombre,
                       telefono: c.telefono,
                       voluntario,
                   }));
                   await manager.save('Contacto_emergencia', nuevosContactos);
              }
              else{
               voluntario = manager.create(Voluntario, {
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
               contactosEmergencia: solicitud.contactosEmergencia.map(c => ({
                   nombre: c.nombre,
                   telefono: c.telefono,
               })),
               });
               await manager.save(voluntario);
              }
   
               const solicitudAprobada = manager.create(SolicitudAprobada, {
               voluntario,
               tipoVoluntariado: voluntariado,
               datosExtra: `Creado por: ${usuario.name}`,
               observaciones: solicitud.observaciones,
               cantidadHoras: solicitud.cantidadHoras,
               horarios: solicitud.horarios.map(h => ({
                   dia: h.dia,
                   horaInicio: h.horaInicio,
                   horaFin: h.horaFin,
               })),
               });
               await manager.save(solicitudAprobada);
           });
   
           return {message: 'Expediente creado correctamente'}
    }

     async updateEstadoSolicitudes(idEstado: number, idSolicitud: number, idUsuario: number): Promise<{ message: string }> {
            const estadosValidos = Object.values(EstadoSolicitud).filter(v => typeof v === 'number') as number[];
            if (!estadosValidos.includes(idEstado)) {
                throw new NotFoundException('Estado no existente');
            }
    
            const estado = EstadoMap[idEstado];
    
            const solicitud = await this.solicitudPendiente.findOne({
                where: { id: idSolicitud },
                relations: ['contactosEmergencia', 'horarios'],
            });
    
            if (!solicitud) {
                throw new NotFoundException(`Solicitud con id ${idSolicitud} no encontrada`);
            }
    
            if(solicitud.estado == 'aprobada'){
                throw new BadRequestException('Esta solicitud ya ha sido aprobada');
            }
    
            if(solicitud.estado == 'rechazada'){
                throw new BadRequestException('Esta solicitud ya ha sido rechazada');
            }
    
            const usuario = await this.gestionUsuario.findOneById(idUsuario)
    
    
            if (estado === 'aprobada') {
                await this.crearSolicitudOficial(solicitud, usuario);
                const totalPendientes = await this.solicitudPendiente.count({ where: { estado: 'pendiente' } });
                await this.emitirTotalSolicitudesPendientes(totalPendientes);
                solicitud.estado = estado;
                await this.solicitudPendiente.save(solicitud);
                return {message: 'Esta solicitud ha sido aceptada'};
            }
    
            if (estado == 'rechazada') {
                solicitud.estado = estado;
                await this.solicitudPendiente.save(solicitud);
                await this.emailService.sendSolicitudRechazadaEmail(solicitud.email, solicitud.nombre)
                const totalPendientes = await this.solicitudPendiente.count({ where: { estado: 'pendiente' } });
                await this.emitirTotalSolicitudesPendientes(totalPendientes);
                return {message: 'Esta solicitud ha sido rechazada'};
            }
    
            const totalPendientes = await this.solicitudPendiente.count({ where: { estado: 'pendiente' } });
            this.voluntariadoGateway.emitSolicitudesPendientesCount(totalPendientes, solicitud);
    
            return {message: 'Estado actualizado correctamente'};
        }
    
        async crearSolicitudOficial(
        solicitud: SolicitudPendiente,
        usuario: Usuario,
        ): Promise<void> {
        await this.dataSource.transaction(async (manager) => {
            const expediente = await manager.findOne(SolicitudAprobada, {
            where: {
                estado: 'Activo',
                voluntario: {
                cedula: solicitud.cedula,
                },
            },
            relations: ['voluntario'],
            });

            if (expediente) {
            throw new BadRequestException(
                'Hay expedientes activos, no se puede aceptar la solicitud',
            );
            }

            let voluntario = await manager.findOne(Voluntario, {
            where: { cedula: solicitud.cedula },
            relations: ['contactosEmergencia'],
            });

            const tipoVoluntariado = await manager.findOne(Tipo_voluntariado, {
            where: { id: solicitud.tipoVoluntariado as unknown as number },
            });

            if (!tipoVoluntariado) {
            throw new NotFoundException('Tipo de voluntariado no encontrado');
            }

            if (voluntario) {
            await manager.delete('Contacto_emergencia', {
                voluntario: voluntario.id,
            });

            const nuevosContactos = solicitud.contactosEmergencia.map((c) => ({
                nombre: c.nombre,
                telefono: c.telefono,
                voluntario,
            }));

            await manager.save('Contacto_emergencia', nuevosContactos);
            } else {
            voluntario = manager.create(Voluntario, {
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
                contactosEmergencia: solicitud.contactosEmergencia.map((c) => ({
                nombre: c.nombre,
                telefono: c.telefono,
                })),
            });

            await manager.save(voluntario);
            }

            const solicitudAprobada = manager.create(SolicitudAprobada, {
            voluntario,
            tipoVoluntariado,
            datosExtra: `Aprobada por: ${usuario.name}`,
            observaciones: solicitud.observaciones,
            estado: 'Activo',
            cantidadHoras: solicitud.cantidadHoras,
            idSolicitud: solicitud.id,
            horarios: solicitud.horarios.map((h) => ({
                dia: h.dia,
                horaInicio: h.horaInicio,
                horaFin: h.horaFin,
            })),
            });

            await manager.save(solicitudAprobada);

            await this.emailService.sendSolicitudAceptadaEmail(
            solicitud.email,
            solicitud.nombre,
            );
        });
        }
 
        private async emitirTotalSolicitudesPendientes(totalPendientes: number): Promise<void> {
            const ultimaSolicitudPendiente = await this.solicitudPendiente.findOne({
                where: { estado: 'pendiente' },
                order: { id: 'DESC' },
            });

            if(!ultimaSolicitudPendiente){
                this.voluntariadoGateway.emitirNomasSolicitudesPendientes();
                return;
            }

            this.voluntariadoGateway.emitSolicitudesPendientesCount(
                totalPendientes,
                ultimaSolicitudPendiente,
            );
        }
}
