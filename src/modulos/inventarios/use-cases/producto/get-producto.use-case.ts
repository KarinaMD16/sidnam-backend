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
        where: { archivado: false },
        select: { nombre: true, codigo: true, unidadMedida: true, },
        order: { id: 'DESC' },
      });
    }

  async findByArchivadoYCategoria(archivado: boolean, categoriaId: number, page?: number, limit?: number): Promise<{ data: Array<{ inventarioId: number; nombre: string; codigo: string; unidadMedida: string }>; total: number }> {

  const qb = this.productoRepository
    .createQueryBuilder('p')
    .innerJoin('p.categoria', 'c')
    .innerJoin('p.inventarios', 'inv')
    .where('p.archivado = :archivado', { archivado })
    .andWhere('c.id = :categoriaId', { categoriaId });

  const total = await qb.clone().select('p.id').distinct(true).getCount();

  qb.select([
    'inv.id AS "inventarioId"',
    'p.nombre AS "nombre"',
    'p.codigo AS "codigo"',
    'p.unidadMedida AS "unidadMedida"',
  ])
  .orderBy('p.id', 'DESC');

  if (page && limit) {
    qb.skip((page - 1) * limit).take(limit);
  }

  const rows = await qb.getRawMany();

  return { data: rows, total };
 }

}