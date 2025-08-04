// use-cases/update-expediente.use-case.ts
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Not, Repository } from 'typeorm';
import { EstadoExpediente } from 'src/common/enums/estadosExpedientes.enum';
import { SolicitudAprobada } from '../../entities/solicitudAprobada.entity';
import { Voluntario } from '../../entities/voluntariado.entity';
import { plainToInstance } from 'class-transformer';
import { ExpedientePreviewDto } from '../../dto/expedientePreviewDto';
import { ExpedienteAprobadoDto } from '../../dto/expedienteDto';
import { verExpedientesByCedula } from '../../dto/verExpedientesByCedulaDto';
import { VerExpedientesActivosDto } from '../../dto/verExpedientesActivosDto';

@Injectable()
export class GetExpedientesUseCase {
  constructor(
    @InjectRepository(SolicitudAprobada)
    private readonly solicitudAprobada: Repository<SolicitudAprobada>,
           
    @InjectRepository(Voluntario)
    private readonly voluntarioRepository: Repository<Voluntario>,

  ) {}

    async findAllPreviewsExpedientes(page?: number, limit?: number): Promise<{ data: ExpedientePreviewDto[]; total: number }> {
            const [data, total] = await this.solicitudAprobada.findAndCount({
                skip: page && limit ? (page - 1) * limit : 0,
                take: limit,
                order: { id: 'DESC' },
                relations: ['voluntario'], 
            });
    
            const dtos = plainToInstance(ExpedientePreviewDto, data, { excludeExtraneousValues: true });
    
            return { data: dtos, total };
    }

   async getByIdExpediente(id: number): Promise<ExpedienteAprobadoDto> {
           const expediente = await this.solicitudAprobada.findOne({
               where: { id },
               relations: [
               'voluntario',
               'voluntario.contactosEmergencia',
               'horarios',
               'actividades',
               'tipoVoluntariado'
               ]
           });
   
           if (!expediente) {
               throw new NotFoundException('Solicitud aprobada no encontrada');
           }
   
           const dto = plainToInstance(ExpedienteAprobadoDto, expediente, {
               excludeExtraneousValues: true,
           });
   
           return dto;
    }

    async getExpedienteActivoByCedula(cedula: string): Promise<verExpedientesByCedula> {
            const voluntario = await this.voluntarioRepository.findOneBy({ cedula });
    
            if (!voluntario) {
                throw new NotFoundException('Cédula inexistente');
            }
    
            const expediente = await this.solicitudAprobada.createQueryBuilder('expediente')
                .leftJoinAndSelect('expediente.voluntario', 'voluntario')
                .where('voluntario.cedula = :cedula', { cedula })
                .andWhere('expediente.estado = :estado', { estado: EstadoExpediente.Activo })
                .orderBy('expediente.id', 'DESC')
                .getOne();
    
            if (!expediente) {
                throw new NotFoundException('No se encontró expediente activo para esta cédula');
            }
    
            return plainToInstance(verExpedientesByCedula, expediente, {
                excludeExtraneousValues: true,
            });
        }
    
        async getExpedientesActivos(page?: number, limit?: number): Promise<{data: VerExpedientesActivosDto[]; total: number}>{
    
            const [expediente, total] = await this.solicitudAprobada.findAndCount({
                skip: page && limit ? (page - 1) * limit : 0,
                where: {estado: EstadoExpediente.Activo},
                take: limit,
                order: { id: 'DESC' },
                select: ['id'],
                relations: ['voluntario'], 
            });
    
            const dtos = plainToInstance(VerExpedientesActivosDto, expediente, { excludeExtraneousValues: true });
    
            return { data: dtos, total };
        }
    
        async getAllExpedientesByCedula(cedula: string,page = 1,limit = 10,): Promise<{ data: verExpedientesByCedula[]; total: number }> {
            const voluntario = await this.voluntarioRepository.findOneBy({ cedula });
    
            if (!voluntario) {
                throw new NotFoundException('Cédula inexistente');
            }
    
            const [expedientes, total] = await this.solicitudAprobada.createQueryBuilder('expediente')
                .leftJoinAndSelect('expediente.voluntario', 'voluntario')
                .where('voluntario.cedula = :cedula', { cedula })
                .orderBy('expediente.id', 'DESC')
                .skip((page - 1) * limit)
                .take(limit)
                .getManyAndCount();
    
            if (total === 0) {
                throw new NotFoundException('No se encontraron expedientes para esta cédula');
            }
    
            const dtos = plainToInstance(verExpedientesByCedula, expedientes, {
                excludeExtraneousValues: true,
            });
    
            return {
                data: dtos,
                total,
            };
            
        }
    
}
