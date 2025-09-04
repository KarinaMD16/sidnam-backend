import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Producto } from "../../entities/producto.entity";
import { Repository } from "typeorm";
import { Inventario } from "../../entities/inventario.entity";
import { getCategoriasId } from "src/common/enums/categoriasPrincipalesProductos.enum";


@Injectable()
export class GetProductosUseCase {
    constructor(

        @InjectRepository(Producto)
        private readonly productoRepository: Repository<Producto>,

        @InjectRepository(Inventario)
    private readonly inventarioRepository: Repository<Inventario>,
    ){}


    async findAllProductos() {
      return this.productoRepository.find({
        where: { archivado: false },
        select: { nombre: true, codigo: true, },
        order: { id: 'DESC' },
      });
    }

  async findByArchivadoYCategoria(archivado: boolean, categoriaId: number, page?: number, limit?: number): Promise<{data: {inventarioId: number; nombre: string; codigo: string; unidadMedida: { nombre: string; abreviatura: string } | null;}[];total: number;}> {

    const categoriaTipo = getCategoriasId(categoriaId);
    if (!categoriaTipo) {
        throw new BadRequestException(`Categoría inválida: ${categoriaId}`);
    }

  const [rows, total] = await this.inventarioRepository.findAndCount({
    where: { producto: { archivado, categoriaTipo } },
    relations: { producto: true, unidad_medida: true },   
    select: {
      id: true,
      producto: { nombre: true, codigo: true },
      unidad_medida: { nombre: true, abreviatura: true },               
    },
    order: { id: 'DESC' },
    skip: page && limit ? (page - 1) * limit : 0,
    take: limit,
  });

  const data = rows.map(i => ({
    inventarioId: i.id,
    nombre: i.producto.nombre,
    codigo: i.producto.codigo,
    unidadMedida: i.unidad_medida
      ? { nombre: i.unidad_medida.nombre, abreviatura: i.unidad_medida.abreviatura }
      : null, 
  }));

  return { data, total };
}





}