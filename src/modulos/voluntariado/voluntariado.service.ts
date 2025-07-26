import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SolicitudPendiente } from './entities/solicitudPendiente.entity';
import { Tipo_voluntariado } from './entities/tipoVoluntariado.entity';
import { CrearSolicitudPendienteDto } from './dto/crearSolicitudPendienteDto';
import { TipoVoluntarioDto } from './dto/crearTipoVoluntarioDto';
import { verSolicitudPendiente } from './dto/verSolicitudPendientoDto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class VoluntariadoService {

    constructor(
        @InjectRepository(SolicitudPendiente)
        private readonly solicitudPendiente: Repository<SolicitudPendiente>,

        @InjectRepository(Tipo_voluntariado)
        private readonly tipoVoluntariado: Repository<Tipo_voluntariado>
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

         return await this.solicitudPendiente.save(crearSolicitud);
    }

    async crearTipoVoluntario(tipoDto: TipoVoluntarioDto): Promise<Tipo_voluntariado>{
        const nuevoTipo = this.tipoVoluntariado.create(tipoDto);
        return await this.tipoVoluntariado.save(nuevoTipo);
    }

    async getAllTipoVoluntario(): Promise<TipoVoluntarioDto[]>{
        return await this.tipoVoluntariado.find()
    }

    async getAllSolicitudes(): Promise<verSolicitudPendiente[]> {
    
        const solicitudes = await this.solicitudPendiente.find({
            relations: ['horarios'], 
        });

        const dto = plainToInstance(verSolicitudPendiente, solicitudes, {
            excludeExtraneousValues: true, 
        });

        return dto;
    }

}
