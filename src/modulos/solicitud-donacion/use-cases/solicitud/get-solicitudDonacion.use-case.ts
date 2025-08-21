import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import { Repository } from "typeorm";
import { Solicitud_donacion_pendiente } from "../../entities/solicitudDonacionPendiente.entity";
import { SolicitudDonacionPreviewDto } from "../../dto/solicitudDonacionPreviewDto";
import { VerSolicitudDonacionPendienteDto } from "../../dto/verSolicitudDonacionPendienteDto";
import { EstadoSolicitud } from "src/common/enums/estadosSolicitudes.enum";
import { EstadoMap } from "src/common/constants/estado.constant";


@Injectable()
export class GetSolicitudesDonacionUseCase {
  constructor(

    @InjectRepository(Solicitud_donacion_pendiente)
    private readonly solicitudDonacionPendiente: Repository<Solicitud_donacion_pendiente>,
    
  ) {}

     async findAllPreviews(page?: number, limit?: number): Promise<{ data: SolicitudDonacionPreviewDto[]; total: number }> {
            const [data, total] = await this.solicitudDonacionPendiente.findAndCount({
                skip: page && limit ? (page - 1) * limit : 0,
                take: limit,
                order: { id: 'DESC' },
                select: ['id', 'nombre', 'apellido1', 'apellido2', "tipoDonacion", 'creadoEn', 'estado'],
            });
    
            const dtos = plainToInstance(SolicitudDonacionPreviewDto, data, { excludeExtraneousValues: true });
    
            return { data: dtos, total };
        }

    
        async findSolicitudById(id: number): Promise<VerSolicitudDonacionPendienteDto> {
            const solicitud = await this.solicitudDonacionPendiente.findOne({
                where: { id },
                select: [
                'id',
                'cedula',
                'nombre',
                'apellido1',
                'apellido2',
                'telefono',
                'email',
                'anonimo',
                'descripcion',
                'tipoDonacion',
                'estado',
                'creadoEn',
                'observaciones',
                ],
            });
    
            if (!solicitud) {
                throw new NotFoundException(`No se encontró la solicitud con id ${id}`);
                
            }
    
            const dto = plainToInstance(VerSolicitudDonacionPendienteDto, solicitud, {
                excludeExtraneousValues: true,
            });
    
            return dto;
    }


     async getFiltrosEstados(id: number, page?: number, limit?: number): Promise<{ data: SolicitudDonacionPreviewDto[]; total: number }> {
                const estadoNombre = Object.values(EstadoSolicitud).filter(v => typeof v === 'number') as number[];
        
                if (!estadoNombre.includes(id)) {
                    throw new NotFoundException('Estado no existente');
                }
        
                const estado = EstadoMap[id];
        
                const [data, total] = await this.solicitudDonacionPendiente.findAndCount({
                    where: { estado: estado },
                    skip: page && limit ? (page - 1) * limit : 0,
                    take: limit,
                    order: { id: 'DESC' },
                    select: ['id', 'nombre', 'apellido1', 'apellido2', 'tipoDonacion', 'creadoEn', 'estado'],
                });
        
                const dtos = plainToInstance(SolicitudDonacionPreviewDto, data, {
                    excludeExtraneousValues: true,
                });
        
                return { data: dtos, total };
        }

}