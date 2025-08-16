import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RegistroDonacion } from "../../entities/registroDonacion.entity";
import { Donador } from "../../entities/donador.entity";
import { RegistroPreviewDto } from "../../dto/registroPreviewDto";
import { plainToInstance } from "class-transformer";
import { RegistroDto } from "../../dto/registroDto";


@Injectable()
export class GetRegistrosDonacionUseCase {
    constructor(
        @InjectRepository(RegistroDonacion)
        private readonly registroDonacion: Repository<RegistroDonacion>,
               
        @InjectRepository(Donador)
        private readonly donadorRepository: Repository<Donador>,
    
      ) {}


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

}