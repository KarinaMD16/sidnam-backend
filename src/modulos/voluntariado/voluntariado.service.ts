import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { SolicitudPendiente } from './entities/solicitudPendiente.entity';
import { Tipo_voluntariado } from './entities/tipoVoluntariado.entity';
import { CrearSolicitudPendienteDto } from './dto/crearSolicitudPendienteDto';
import { TipoVoluntarioDto } from './dto/crearTipoVoluntarioDto';
import { plainToInstance } from 'class-transformer';
import { SolicitudPreviewDto } from './dto/solicitudPreviewDto';
import { VoluntariadoGateway } from './voluntariado.gateway';
import { verSolicitud } from './dto/verSolicitudPendientoDto';
import { EstadoSolicitud } from 'src/common/enums/estadosSolicitudes.enum';
import { EstadoMap } from 'src/common/constants/estado.constant';
import { SolicitudAprobada } from './entities/solicitudAprobada.entity';
import { Voluntario } from './entities/voluntariado.entity';
import { EmailService } from '../autenticacion/email/email.service';
import { GestionUsuarioService } from '../gestion-usuario/gestion-usuario.service';
import { Usuario } from '../gestion-usuario/entities/usuario.entity';


@Injectable()
export class VoluntariadoService {

    constructor(
        @InjectRepository(SolicitudPendiente)
        private readonly solicitudPendiente: Repository<SolicitudPendiente>,

        @InjectRepository(Tipo_voluntariado)
        private readonly tipoVoluntariado: Repository<Tipo_voluntariado>,

        private readonly voluntariadoGateway: VoluntariadoGateway,

        private readonly dataSource: DataSource,

        private readonly emailService: EmailService,

        private readonly gestionUsuario: GestionUsuarioService
    ){}


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
            contactosEmergencia: solicitud.contactosEmergencia ?? [],
            horarios: solicitud.horarios ?? [],
        })

         const solicitudPentiende = await this.solicitudPendiente.save(crearSolicitud);

         const total = await this.solicitudPendiente.count({where: {estado: 'pendiente'}})
         this.voluntariadoGateway.emitSolicitudesPendientesCount(total)

         return solicitudPentiende
    }

    async crearTipoVoluntario(tipoDto: TipoVoluntarioDto): Promise<Tipo_voluntariado>{
        const nuevoTipo = this.tipoVoluntariado.create(tipoDto);
        return await this.tipoVoluntariado.save(nuevoTipo);
    }

    async getAllTipoVoluntario(): Promise<TipoVoluntarioDto[]>{
        return await this.tipoVoluntariado.find()
    }

    async findAllPreviews(page?: number, limit?: number): Promise<{ data: SolicitudPreviewDto[]; total: number }> {
        const [data, total] = await this.solicitudPendiente.findAndCount({
            skip: page && limit ? (page - 1) * limit : 0,
            take: limit,
            order: { id: 'DESC' },
            select: ['id', 'nombre', 'apellido1', 'apellido2', 'creadoEn', 'estado'],
        });

        const dtos = plainToInstance(SolicitudPreviewDto, data, { excludeExtraneousValues: true });

        return { data: dtos, total };
    }

    async findSolicitudById(id: number): Promise<verSolicitud> {
        const solicitud = await this.solicitudPendiente.findOne({
            where: { id },
            select: [
            'id',
            'cedula',
            'nombre',
            'apellido1',
            'apellido2',
            'email',
            'telefono',
            'ocupacion',
            'direccion',
            'sexo',
            'experienciaLaboral',
            'tipoVoluntariado',
            'creadoEn',
            'estado',
            ],
            relations: ['horarios'], 
        });

        if (!solicitud) {
            throw new NotFoundException(`No se encontró la solicitud con id ${id}`);
            
        }

        const dto = plainToInstance(verSolicitud, solicitud, {
            excludeExtraneousValues: true,
        });

        return dto;
    }

    async getEstadosSolicitud() {

        const estados = Object.entries(EstadoSolicitud)
        .filter(([key, value]) => typeof value === 'number') 
        .map(([key, value]) => ({
            id: value as number,
            nombre: key,
        }));

        return estados;
    }

    async getFiltosEstados(id: number, page?: number, limit?: number): Promise<{ data: SolicitudPreviewDto[]; total: number }> {
        const estadoNombre = Object.values(EstadoSolicitud).filter(v => typeof v === 'number') as number[];

        if (!estadoNombre.includes(id)) {
            throw new NotFoundException('Estado no existente');
        }

        const estado = EstadoMap[id];

        const [data, total] = await this.solicitudPendiente.findAndCount({
            where: { estado },
            skip: page && limit ? (page - 1) * limit : 0,
            take: limit,
            order: { id: 'DESC' },
            select: ['id', 'nombre', 'apellido1', 'apellido2', 'creadoEn', 'estado'],
        });

        const dtos = plainToInstance(SolicitudPreviewDto, data, {
            excludeExtraneousValues: true,
        });

        return { data: dtos, total };
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

        solicitud.estado = estado;
        await this.solicitudPendiente.save(solicitud);

        if (estado === 'aprobada') {
            await this.crearSolicitudOficial(solicitud, usuario);
            return {message: 'Esta solicitud ha sido aceptada'};
        }

        if (estado == 'rechazada') {
            await this.emailService.sendSolicitudRechazadaEmail(solicitud.email, solicitud.nombre)
            return {message: 'Esta solicitud ha sido rechazada'};
        }

        const totalPendientes = await this.solicitudPendiente.count({ where: { estado: 'pendiente' } });
        this.voluntariadoGateway.emitSolicitudesPendientesCount(totalPendientes);

        return {message: 'Estado actualizado correctamente'};
    }

    async crearSolicitudOficial(solicitud: SolicitudPendiente, usuario: Usuario): Promise<void> {
        await this.dataSource.transaction(async manager => {
    
            const voluntario = manager.create(Voluntario, {
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

            const tipoVoluntariado = await manager.findOne(Tipo_voluntariado, {
            where: { id: solicitud.tipoVoluntariado as unknown as number },
            });
            if (!tipoVoluntariado) {
            throw new NotFoundException(`Tipo de voluntariado no encontrado`);
            }

            const solicitudAprobada = manager.create(SolicitudAprobada, {
            voluntario,
            tipoVoluntariado,
            datosExtra: `Aprobada por: ${usuario.name}`,
            horarios: solicitud.horarios.map(h => ({
                dia: h.dia,
                horaInicio: h.horaInicio,
                horaFin: h.horaFin,
            })),
            });
            await manager.save(solicitudAprobada);
        });

        await this.emailService.sendSolicitudAceptadaEmail(solicitud.email, solicitud.nombre);
    }
}
