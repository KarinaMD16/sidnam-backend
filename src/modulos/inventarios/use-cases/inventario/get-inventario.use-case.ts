import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { InventarioPreviewDto } from "../../dto/inventarioPreviewDto";
import { plainToInstance } from "class-transformer";
import { Inventario } from "../../entities/inventario.entity";


@Injectable()
export class GetInventarioUseCase {

    constructor(

        @InjectRepository(Inventario)
        private readonly inventarioRepository: Repository<Inventario>,

    ) {}


  async findAllInventarios(categoriaId: number, page?: number, limit?: number): Promise<{ data: InventarioPreviewDto[]; total: number }> {

  const [data, total] = await this.inventarioRepository.findAndCount({
    where: { producto: { categoria: { id: categoriaId } } },   
    relations: { producto: { categoria: true } },
    order: { id: 'DESC' },
    skip: page && limit ? (page - 1) * limit : 0,
    take: limit,
  });

  const dtos = plainToInstance(InventarioPreviewDto, data, { excludeExtraneousValues: true });
  return { data: dtos, total };
}



    
}