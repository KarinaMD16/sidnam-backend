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


  async findAllInventarios(categoriaId: number, page?: number, limit?: number,): Promise<{data: Array<{id: number; stock: number; codigo: string; nombre: string; unidadMedida: { nombre: string; abreviatura: string } | null;}>; total: number;}> {
  const [rows, total] = await this.inventarioRepository.findAndCount({
    where: { producto: { archivado: false, categoria: { id: categoriaId } } },
    relations: {
      producto: { categoria: true },
      unidad_medida: true,                       
    },
    select: {
      id: true,
      stock: true,
      producto: {
        id: true,
        nombre: true,
        codigo: true,
        categoria: { id: true },
      },
      unidad_medida: {                          
        nombre: true,
        abreviatura: true,
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
    unidadMedida: i.unidad_medida
      ? { nombre: i.unidad_medida.nombre, abreviatura: i.unidad_medida.abreviatura }
      : null,                                     
  }));

  return { data, total };
}


    async findAllByCategoriaSinPaginacion(categoriaId: number): Promise<Array<{id: number;stock: number;codigo: string;nombre: string;unidadMedida: { nombre: string; abreviatura: string } | null;}>> {
  const rows = await this.inventarioRepository.find({
    where: { producto: { categoria: { id: categoriaId }, archivado: false } },
    relations: {
      producto: true,
      unidad_medida: true,                        
    },
    select: {
      id: true,
      stock: true,
      producto: { codigo: true, nombre: true },
      unidad_medida: {
        nombre: true,
        abreviatura: true,
      },
    },
    order: { id: 'DESC' },
  });

  return rows.map(i => ({
    id: i.id,
    stock: i.stock,
    codigo: i.producto.codigo,
    nombre: i.producto.nombre,
    unidadMedida: i.unidad_medida
      ? { nombre: i.unidad_medida.nombre, abreviatura: i.unidad_medida.abreviatura }
      : null,                                     
  }));
 }

}