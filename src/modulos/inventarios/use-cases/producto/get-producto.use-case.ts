import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Producto } from "../../entities/producto.entity";
import { Repository } from "typeorm";
import { Categoria_Producto } from "../../entities/categoriaProducto.entity";
import { Inventario } from "../../entities/inventario.entity";


@Injectable()
export class GetProductosUseCase {
    constructor(

        @InjectRepository(Producto)
        private readonly productoRepository: Repository<Producto>,

        @InjectRepository(Categoria_Producto)
        private readonly categoriaRepository: Repository<Categoria_Producto>,

        @InjectRepository(Inventario)
    private readonly inventarioRepository: Repository<Inventario>,
    ){}


    async findAllProductos() {
      return this.productoRepository.find({
        where: { archivado: false },
        select: { nombre: true, codigo: true, unidadMedida: true, },
        order: { id: 'DESC' },
      });
    }

  async findByArchivadoYCategoria(archivado: boolean, categoriaId: number, page?: number, limit?: number): Promise<{data: { inventarioId: number; nombre: string; codigo: string; unidadMedida: string }[];total: number;}> {
  const [rows, total] = await this.inventarioRepository.findAndCount({
    where: { producto: { archivado, categoria: { id: categoriaId } } }, 
    relations: { producto: { categoria: true } },                       
    select: {
      id: true,                                                        
      producto: { nombre: true, codigo: true, unidadMedida: true },
    },
    order: { id: 'DESC' },
    skip: page && limit ? (page - 1) * limit : 0,                       
    take: limit,                                                        
  });

  const data = rows.map(i => ({
    inventarioId: i.id,
    nombre: i.producto.nombre,
    codigo: i.producto.codigo,
    unidadMedida: i.producto.unidadMedida,
  }));

  return { data, total };
}




}