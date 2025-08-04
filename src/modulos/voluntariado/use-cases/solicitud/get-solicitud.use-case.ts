
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { SolicitudPendiente } from '../../entities/solicitudPendiente.entity';
import { plainToInstance } from 'class-transformer';
import { verSolicitud } from '../../dto/verSolicitudPendientoDto';
import { SolicitudPreviewDto } from '../../dto/solicitudPreviewDto';
import { EstadoMap } from 'src/common/constants/estado.constant';
import { EstadoSolicitud } from 'src/common/enums/estadosSolicitudes.enum';

@Injectable()
export class GetSolicitudesUseCase {
  constructor(

    @InjectRepository(SolicitudPendiente)
    private readonly solicitudPendiente: Repository<SolicitudPendiente>,
    
  ) {}

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
                'observaciones',
                'cantidadHoras'
                ],
                relations: ['horarios', 'contactosEmergencia']
            });
    
            if (!solicitud) {
                throw new NotFoundException(`No se encontró la solicitud con id ${id}`);
                
            }
    
            const dto = plainToInstance(verSolicitud, solicitud, {
                excludeExtraneousValues: true,
            });
    
            return dto;
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
    
    
}
