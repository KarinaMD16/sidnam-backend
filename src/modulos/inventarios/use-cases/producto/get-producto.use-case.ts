import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Producto } from "../../entities/producto.entity";
import { Repository } from "typeorm";
import { Categoria_Producto } from "../../entities/categoriaProducto.entity";


@Injectable()
export class GetProductosUseCase {
    constructor(

        @InjectRepository(Producto)
        private readonly productoRepository: Repository<Producto>,

        @InjectRepository(Categoria_Producto)
        private readonly categoriaRepository: Repository<Categoria_Producto>,
    ){}


    async findAllProductos() {
      return this.productoRepository.find({
        relations: { categoria: true },              
        select: {                                    
          id: true, nombre: true, codigo: true, archivado: true, unidadMedida: true,
          categoria: { id: true, nombre: true }
        },
        order: { id: 'DESC' },
    });
   }

   async findByCategoriaId(categoriaId: number, page?: number, limit?: number): Promise<{ data: any[]; total: number}> {
        const categoria = await this.categoriaRepository.exist({ where: { id: categoriaId } });
          if (!categoria) throw new NotFoundException('Categoría no encontrada');

        const [data, total] = await this.productoRepository.findAndCount({
            where: { categoria: { id: categoriaId } },
            relations: { categoria: true },
            select: {
            id: true, nombre: true, codigo: true, archivado: true, unidadMedida: true,
            categoria: { id: true, nombre: true },
            },
            order: { id: 'DESC' },
            skip: page && limit ? (page - 1) * limit : 0,   
            take: limit,                                     
            });

             return { data, total };
    }

    async findByArchivado(archivado: boolean, page?: number, limit?: number): Promise<{ data: any[]; total: number }> {
       const [data, total] = await this.productoRepository.findAndCount({
        where: { archivado },
        relations: { categoria: true },
        select: {
          id: true,
          nombre: true,
          codigo: true,
          unidadMedida: true,
          archivado: true,
          categoria: { id: true, nombre: true },
       },
       order: { id: 'DESC' },
       skip: page && limit ? (page - 1) * limit : 0,
       take: limit,
     });

     return { data, total };
  }

}