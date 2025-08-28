import { Injectable } from "@nestjs/common";
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

  async findByArchivadoYCategoria(archivado: boolean, categoriaId: number, page?: number, limit?: number): Promise<{ data: any[]; total: number }> {
     const [data, total] = await this.productoRepository.findAndCount({
       where: { archivado, categoria: { id: categoriaId } },
       relations: { categoria: true },
       select: {
        id: true, nombre: true, codigo: true, unidadMedida: true, archivado: true,
        categoria: { id: true, nombre: true },
      },
      order: { id: 'DESC' },
      skip: page && limit ? (page - 1) * limit : 0,
      take: limit,
    });
    return { data, total };
  }

}