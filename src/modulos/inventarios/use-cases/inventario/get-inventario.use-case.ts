import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Inventario } from "../../entities/inventario.entity";


@Injectable()
export class GetInventarioUseCase {

    constructor(

        @InjectRepository(Inventario)
        private readonly inventarioRepository: Repository<Inventario>,

    ) {}


  async findAllInventarios(categoriaId: number, page?: number, limit?: number): Promise<{ data: Array<{ id: number; stock: number; codigo: string; nombre: string; categoriaId: number }>; total: number }> {

    const [rows, total] = await this.inventarioRepository.findAndCount({
    where: { producto: { archivado: false, categoria: { id: categoriaId } } },
    relations: { producto: { categoria: true } },
    select: {
      id: true,
      stock: true,
      producto: {
        id: true,
        nombre: true,
        codigo: true,
        categoria: { id: true },
      },
    },
    order: { id: 'DESC' },
    skip: page && limit ? (page - 1) * limit : 0,
    take: limit,
  });

  
  const data = rows.map(i => ({
    id: i.id,
    stock: i.stock,
    codigo: i.producto.codigo,
    nombre: i.producto.nombre,
    categoriaId: i.producto.categoria.id,
  }));

  return { data, total };
}

    async findAllByCategoriaSinPaginacion(categoriaId: number): Promise<Array<{ id: number; stock: number; codigo: string; nombre: string }>> {
    const rows = await this.inventarioRepository.find({
      where: { producto: { categoria: { id: categoriaId } } },
      relations: { producto: true },
      select: {
        id: true,
        stock: true,
        producto: { codigo: true, nombre: true },
      },
      order: { id: 'DESC' },
    });

    return rows.map(i => ({
      id: i.id,
      stock: i.stock,
      codigo: i.producto.codigo,
      nombre: i.producto.nombre,
    }));
  }


}