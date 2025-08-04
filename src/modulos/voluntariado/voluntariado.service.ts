import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SolicitudPendiente } from './entities/solicitudPendiente.entity';
import { Tipo_voluntariado } from './entities/tipoVoluntariado.entity';
import { TipoVoluntarioDto } from './dto/crearTipoVoluntarioDto';
import { plainToInstance } from 'class-transformer';
import { SolicitudPreviewDto } from './dto/solicitudPreviewDto';
import { EstadoSolicitud } from 'src/common/enums/estadosSolicitudes.enum';
import { EstadoMap } from 'src/common/constants/estado.constant';
import { SolicitudAprobada } from './entities/solicitudAprobada.entity';
import { CrearACtividadesDto } from './dto/crearActividadesDto';
import { Actividades } from './entities/actividades.entity';
import { verActividadesDto } from './dto/verActividadesDto';


@Injectable()
export class VoluntariadoService {

    constructor(
        @InjectRepository(SolicitudPendiente)
        private readonly solicitudPendiente: Repository<SolicitudPendiente>,

        @InjectRepository(Tipo_voluntariado)
        private readonly tipoVoluntariado: Repository<Tipo_voluntariado>,

        @InjectRepository(SolicitudAprobada)
        private readonly solicitudAprobada: Repository<SolicitudAprobada>,

        @InjectRepository(Actividades)
        private readonly actividadesRepository: Repository<Actividades>,

    ){}


    async crearTipoVoluntario(tipoDto: TipoVoluntarioDto): Promise<Tipo_voluntariado>{
        const nuevoTipo = this.tipoVoluntariado.create(tipoDto);
        return await this.tipoVoluntariado.save(nuevoTipo);
    }

    async getAllTipoVoluntario(): Promise<TipoVoluntarioDto[]>{
        return await this.tipoVoluntariado.find()
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

    async createActividades(crearActividades: CrearACtividadesDto, idExpediente: number): Promise<{ message: string }> {


        const expediente = await this.solicitudAprobada.findOne({
            where: { id: idExpediente },
        });

        if (!expediente) {
            throw new NotFoundException('Expediente no encontrado');
        }

        if(expediente.estado == "Inactivo"){
            throw new NotFoundException('Expediente inactivo. no puedes agregar actividades');
        }

        const nuevaActividad = this.actividadesRepository.create({
            fecha: crearActividades.fecha,
            cantidadHoras: crearActividades.cantidadHoras,
            actividades: crearActividades.actividades,
            solicitud: expediente,
        });

        await this.actividadesRepository.save(nuevaActividad);

        return { message: 'Actividad agregada correctamente' };
    }

    async getActividades(idExpediente: number, page = 1,limit = 10,): Promise<{ data: verActividadesDto[]; total: number }> {
        const solicitud = await this.solicitudAprobada.findOne({
            where: { id: idExpediente },
            relations: ['actividades'],
        });

        if (!solicitud) {
            throw new NotFoundException('Expediente no encontrado');
        }

        const total = solicitud.actividades.length;

        const actividadesPaginadas = solicitud.actividades.slice(
            (page - 1) * limit,
            page * limit,
        );

        const data = plainToInstance(verActividadesDto, actividadesPaginadas, {
            excludeExtraneousValues: true,
        });

        return { data, total };
    }

}
