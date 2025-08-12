import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { EstadoMap } from "src/common/constants/estado.constant";
import { EstadoSolicitud } from "src/common/enums/estadosSolicitudes.enum";
import { Solicitud_donacion_pendiente } from "../../entities/solicitudDonacionPendiente.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { GestionUsuarioService } from "src/modulos/gestion-usuario/gestion-usuario.service";
import { EmailService } from "src/modulos/autenticacion/email/email.service";
import { SolicitudDonacionGateway } from "../../solicitudDonacion.gateway";
import { Usuario } from "src/modulos/gestion-usuario/entities/usuario.entity";
import { RegistroDonacion } from "../../entities/registroDonacion.entity";
import { Donador } from "../../entities/donador.entity";



@Injectable()
export class CreateRegistroDonacionUseCase {


    constructor(
        
            @InjectRepository(Solicitud_donacion_pendiente)
            private readonly solicitudPendiente: Repository<Solicitud_donacion_pendiente>,

            @InjectRepository(RegistroDonacion)
                private readonly solicitudDonacionAprobada: Repository<RegistroDonacion>,

                @InjectRepository(Donador)
                    private readonly donadorRepository: Repository<Donador>,
            

            private readonly dataSource: DataSource,
            
            private readonly emailService: EmailService,

            private readonly gestionUsuario: GestionUsuarioService,

            private readonly solicitudDonacionGateway: SolicitudDonacionGateway,
        
          ) {}
    

async updateEstadoSolicitudes(idEstado: number, idSolicitud: number, idUsuario: number): Promise<{ message: string }> {
            const estadosValidos = Object.values(EstadoSolicitud).filter(v => typeof v === 'number') as number[];
            if (!estadosValidos.includes(idEstado)) {
                throw new NotFoundException('Estado no existente');
            }
    
            const estado = EstadoMap[idEstado];
    
            const solicitud = await this.solicitudPendiente.findOne({
                where: { id: idSolicitud },
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
                await this.crearSolicitudDonacionOficial(solicitud, usuario);
                solicitud.estado = estado;
                await this.solicitudPendiente.save(solicitud);
                return {message: 'Esta solicitud ha sido aceptada'};
            }
    
            if (estado == 'rechazada') {
                await this.emailService.sendSolicitudDonacionRechazadaEmail(solicitud.email, solicitud.nombre)
                solicitud.estado = estado;
                await this.solicitudPendiente.save(solicitud);
                return {message: 'Esta solicitud ha sido rechazada'};
            }
    
            const totalPendientes = await this.solicitudPendiente.count({ where: { estado: 'pendiente' } });
            this.solicitudDonacionGateway.emitSolicitudesPendientesCount(totalPendientes);
    
            return {message: 'Estado actualizado correctamente'};
        }


         async crearSolicitudDonacionOficial(solicitud: Solicitud_donacion_pendiente, usuario: Usuario): Promise<void> {
            try{
            await this.dataSource.transaction(async manager => {

             let donador = await this.donadorRepository.findOne({
              where: { cedula: solicitud.cedula }
             });

                if (!donador) {
                    donador = manager.create(Donador, {
                    cedula: solicitud.cedula,
                    nombre: solicitud.nombre,
                    apellido1: solicitud.apellido1,
                    apellido2: solicitud.apellido2,
                    telefono: solicitud.telefono,
                    email: solicitud.email,
                    anonimo: solicitud.anonimo,
                    descripcion: solicitud.descripcion,
                });

                await manager.save(donador);
                }

                const registro = manager.create(RegistroDonacion, {
                donador,
                aprobadaPor: `Aprobada por: ${usuario.name}`,
                observaciones: solicitud.observaciones,
                estado: 'Procesada',
                recibidaEn: null,
                });

                await manager.save(registro);
            });

            await this.emailService.sendSolicitudDonacionAceptadaEmail(solicitud.email, solicitud.nombre);
            } catch (error) {
    console.error('🔥 Error en crearSolicitudDonacionOficial:', error);
    throw new InternalServerErrorException('Error al procesar la solicitud de donación');
          }
     }
}