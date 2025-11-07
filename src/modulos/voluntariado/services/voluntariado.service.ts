import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SolicitudPendiente } from '../entities/solicitudPendiente.entity';
import { Tipo_voluntariado } from '../entities/tipoVoluntariado.entity';
import { TipoVoluntarioDto } from '../dto/crearTipoVoluntarioDto';
import { plainToInstance } from 'class-transformer';
import { SolicitudPreviewDto } from '../dto/solicitudPreviewDto';
import { EstadoSolicitud } from 'src/common/enums/estadosSolicitudes.enum';
import { EstadoMap } from 'src/common/constants/estado.constant';
import { SolicitudAprobada } from '../entities/solicitudAprobada.entity';
import { CrearACtividadesDto } from '../dto/crearActividadesDto';
import { Actividades } from '../entities/actividades.entity';
import { verActividadesDto } from '../dto/verActividadesDto';
import { TipoVoluntariadoOpts, TipoVoluntario } from 'src/common/enums/tipoVoluntarios.enum';


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

        if (!Object.values(TipoVoluntario).includes(tipoDto.nombre)) {
            throw new BadRequestException(`El nombre debe ser uno de: ${Object.values(TipoVoluntario).join(', ')}`);
        }
        const nuevoTipo = this.tipoVoluntariado.create(tipoDto);
        return await this.tipoVoluntariado.save(nuevoTipo);
    }

    async getAllTipoVoluntario(){
        return TipoVoluntariadoOpts.map(opt => ({
            id: opt.id,
            nombre: opt.nombre
        }));
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
            where: { 
                id: idExpediente,
            },
            relations: ['tipoVoluntariado']
        });

        if (!expediente) {
            throw new NotFoundException('Expediente no encontrado');
        }

        if (new Date(crearActividades.fecha) <= new Date(expediente.aprobadaEn)) {
        throw new BadRequestException(
            'La fecha de actividad tiene que ser mayor o igual a la fecha de aprobación del expediente'
        );
        }

        if(expediente.estado == "Inactivo"){
            throw new NotFoundException('Expediente inactivo. no puedes agregar actividades');
        }

        if(crearActividades.cantidadHoras){

            if(expediente.tipoVoluntariado.nombre == TipoVoluntario.Horas){

                const nuevaActividad = this.actividadesRepository.create({
                fecha: crearActividades.fecha,
                cantidadHoras: crearActividades.cantidadHoras,
                actividades: crearActividades.actividades,
                solicitud: expediente,
            })

            await this.actividadesRepository.save(nuevaActividad)
              const { total } = await this.actividadesRepository
                .createQueryBuilder('actividad')
                .select('SUM(actividad.cantidadHoras)', 'total')
                .where('actividad.solicitud_aprobada_id = :id', { id: idExpediente })
                .getRawOne();

                expediente.progreso_horas = Number(total) || 0;
                if (expediente.progreso_horas >= expediente.cantidadHoras) {
                    expediente.estado = 'Inactivo';
                }
                
                await this.solicitudAprobada.save(expediente);
                return { message: 'Actividad agregada correctamente' };
            }
        
            const nuevaActividad = this.actividadesRepository.create({
            fecha: crearActividades.fecha,
            cantidadHoras: crearActividades.cantidadHoras,
            actividades: crearActividades.actividades,
            solicitud: expediente,

            })

            await this.actividadesRepository.save(nuevaActividad)
            return { message: 'Actividad agregada correctamente' };
        }
        else{
            
            if(expediente.tipoVoluntariado.nombre == TipoVoluntario.Horas){
                throw new BadRequestException('El voluntario de este tipo tiene que registrer sus horas')
            }

            const nuevaActividad = this.actividadesRepository.create({
            fecha: crearActividades.fecha,
            actividades: crearActividades.actividades,
            solicitud: expediente,
            })

            await this.actividadesRepository.save(nuevaActividad)
    
        }
        
      
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
