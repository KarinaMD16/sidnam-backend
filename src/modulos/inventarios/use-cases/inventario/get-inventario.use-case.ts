import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, MoreThan, Not, Repository } from "typeorm";
import { Inventario } from "../../entities/inventario.entity";
import { getCategoriasId } from "src/common/enums/categoriasPrincipalesProductos.enum";


@Injectable()
export class GetInventarioUseCase {

    constructor(

        @InjectRepository(Inventario)
        private readonly inventarioRepository: Repository<Inventario>,

    ) {}


  async findAllInventarios(categoriaId: number, page?: number, limit?: number): Promise<{data: Array<{id: number; stock: number; codigo: string; nombre: string; unidadMedida: { id: number; nombre: string; abreviatura: string } | null;}>;total: number;}> {

    const categoriaTipo = getCategoriasId(categoriaId);
    if (!categoriaTipo) {
      throw new BadRequestException(`Categoría inválida: ${categoriaId}`);
    }

  const [rows, total] = await this.inventarioRepository.findAndCount({
    where: { producto: { archivado: false, categoriaTipo, } },
    relations: {
      producto: true,
      unidad_medida: true,
    },
    select: {
      id: true,
      stock: true,
      producto: {
        id: true,
        nombre: true,
        codigo: true,
        categoriaTipo: true ,
      },
      unidad_medida: {
        id_unidad: true,          
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
      ? {
          id: i.unidad_medida.id_unidad,    
          nombre: i.unidad_medida.nombre,
          abreviatura: i.unidad_medida.abreviatura,
        }
      : null,
  }));

  return { data, total };
}



    async findAllByCategoriaSinPaginacion(categoriaId: number): Promise<Array<{id: number;stock: number;codigo: string;nombre: string;unidadMedida: { nombre: string; abreviatura: string } | null;}>> {

      const categoriaTipo = getCategoriasId(categoriaId);
      if (!categoriaTipo) {
         throw new BadRequestException(`Categoría inválida: ${categoriaId}`);
      }

  const rows = await this.inventarioRepository.find({
    where: { producto: { categoriaTipo, archivado: false } },
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

 async findAllBySubcategoria(subcategoriaId: number): Promise<{data: Array<{inventarioId: number; stock: number; nombreProducto: string; codigoProducto: string; nombreUnidadMedida: string | null; abreviaturaUnidadMedida: string | null; imagen: string | null;}>; total: number;}> {
  const rows = await this.inventarioRepository.find({
    where: {
      producto: {
        archivado: false,
        subcategoria: { id: subcategoriaId },
      },
      stock: MoreThan(0),
    },
    relations: {
      producto: { subcategoria: true },
      unidad_medida: true,
    },
    select: {
      id: true,
      stock: true,
      producto: {
        id: true,
        nombre: true,
        codigo: true,
        imagen_url: true,
        subcategoria: { id: true },
      },
      unidad_medida: {
        id_unidad: true,
        nombre: true,
        abreviatura: true,
      },
    },
    order: { id: 'DESC' },
  });

  const data = rows.map((i) => ({
    inventarioId: i.id,
    stock: i.stock,
    nombreProducto: i.producto.nombre,
    codigoProducto: i.producto.codigo,
    nombreUnidadMedida: i.unidad_medida ? i.unidad_medida.nombre : null,
    abreviaturaUnidadMedida: i.unidad_medida ? i.unidad_medida.abreviatura : null,
    imagen: i.producto.imagen_url ?? null,
  }));

  return { data, total: data.length };
 } 




async findAllActivosConStock(): Promise<{data: Array<{inventarioId: number;stock: number;nombreProducto: string;codigoProducto: string;nombreUnidadMedida: string | null;abreviaturaUnidadMedida: string | null;imagen: string | null;}>;total: number;}> {
  const rows = await this.inventarioRepository.find({
    where: {
      producto: {
        archivado: false,                 
        subcategoria: { id: Not(IsNull()) }, 
      },
      stock: MoreThan(0),                 
    },
    relations: {
      producto: { subcategoria: true },   
      unidad_medida: true,
    },
    select: {
      id: true,
      stock: true,
      producto: {
        id: true,
        nombre: true,
        codigo: true,
        imagen_url: true,
      },
      unidad_medida: {
        id_unidad: true,
        nombre: true,
        abreviatura: true,
      },
    },
    order: { id: 'DESC' },
  });

  const data = rows.map((i) => ({
    inventarioId: i.id,
    stock: i.stock,
    nombreProducto: i.producto.nombre,
    codigoProducto: i.producto.codigo,
    nombreUnidadMedida: i.unidad_medida ? i.unidad_medida.nombre : null,
    abreviaturaUnidadMedida: i.unidad_medida ? i.unidad_medida.abreviatura : null,
    imagen: i.producto.imagen_url ?? null,
  }));

  return { data, total: data.length };
}


}