import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, FindOptionsWhere, Like, Repository } from "typeorm";
import { RegistroDonacion } from "../../entities/registroDonacion.entity";
import { Donador } from "../../entities/donador.entity";
import { RegistroPreviewDto } from "../../dto/registroPreviewDto";
import { plainToInstance } from "class-transformer";
import { RegistroDto } from "../../dto/registroDto";
import { Solicitud_donacion_pendiente } from "../../entities/solicitudDonacionPendiente.entity";
import { VerIdDeSolicitudEnExpedienteDto } from "../../dto/verIdDeSolicitudEnExpedienteDto";

@Injectable()
export class GetRegistrosDonacionUseCase {
    constructor(
        @InjectRepository(RegistroDonacion)
        private readonly registroDonacion: Repository<RegistroDonacion>,

        @InjectRepository(Donador)
        private readonly donadorRepository: Repository<Donador>,

        @InjectRepository(Solicitud_donacion_pendiente)
        private readonly solicitudDonacionPendienteRepository: Repository<Solicitud_donacion_pendiente>

    ) { }


    async findAllPreviewsRegistros(page?: number, limit?: number): Promise<{ data: RegistroPreviewDto[]; total: number }> {
        const [data, total] = await this.registroDonacion.findAndCount({
            skip: page && limit ? (page - 1) * limit : 0,
            take: limit,
            order: { id: 'DESC' },
            relations: ['donador'],
        });

        const dtos = plainToInstance(RegistroPreviewDto, data, { excludeExtraneousValues: true });

        return { data: dtos, total };
    }


    async getRegistroById(id: number): Promise<RegistroDto> {
        const registro = await this.registroDonacion.findOne({
            where: { id },
            relations: ['donador',]
        });

        if (!registro) {
            throw new NotFoundException('Registro no encontrado');
        }

        const dto = plainToInstance(RegistroDto, registro, {
            excludeExtraneousValues: true,
        });

        return dto;
    }

    async getFiltrado({ search, recibida, fechaInicio, fechaFin, page, limit }: any) {

        const where: FindOptionsWhere<RegistroDonacion> = {};

        if (search) {
            where.tipoDonacion = Like(`%${search}%`);
        }

        if (recibida !== undefined) {
            where.recibida = recibida === 'true';
        }

        if (fechaInicio && fechaFin) {
            where.aprobadaEn = Between(new Date(fechaInicio), new Date(fechaFin));
        }

        const [data, total] = await this.registroDonacion.findAndCount({
            where,
            skip: page && limit ? (page - 1) * limit : 0,
            take: limit,
            relations: ['donador'],
            order: { aprobadaEn: 'DESC' },
        });

        return { data, total };
    }

    async getResgistrosBySolicitudID(id: number): Promise<VerIdDeSolicitudEnExpedienteDto> {

        const solicitud = await this.solicitudDonacionPendienteRepository.findOne({
            where: {id},
            relations: ['donador']
        });

        if (!solicitud) {
            throw new NotFoundException('Solicitud no encontrada');
        }

        if(solicitud.estado === 'pendiente'){
            throw new NotFoundException('La solicitud aún no ha sido aprobada');
        }

        if(solicitud.estado === 'rechazada'){
            throw new NotFoundException('La solicitud ha sido rechazada');
        }

        const registros = await this.registroDonacion.findOne({
            where: { idSolicitud: id },
        })

        if(!registros){
            throw new NotFoundException('No se encontró un registro de donación para esta solicitud');
        }

         const dto = plainToInstance(VerIdDeSolicitudEnExpedienteDto, registros, {
            excludeExtraneousValues: true,
        });

        return dto;
    
    }

}