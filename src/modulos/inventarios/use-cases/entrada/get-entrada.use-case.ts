import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Entrada } from '../../entities/entrada.entity';
import { getCategoriasId } from 'src/common/enums/categoriasPrincipalesProductos.enum';

@Injectable()
export class GetEntradaUseCase {
  constructor(
    @InjectRepository(Entrada)
    private readonly entradaRepository: Repository<Entrada>,
  ) {}

  async getEntradasPorMes(mes: number, anio: number, categoriaId: number, page = 1, limit = 0): Promise<{data: Array<{entrada_id: number; fecha: string; cantidad: number; codigo_producto: string; nombre: string; unidadMedida: { nombre: string; abreviatura: string } | null;}>;total: number;}> {
  if (mes < 1 || mes > 12) throw new BadRequestException('Mes inválido (1-12)');
  if (anio < 2000 || anio > 2100) throw new BadRequestException('Año inválido');
  if (!categoriaId || Number.isNaN(+categoriaId)) {
    throw new BadRequestException('categoriaId es requerido');
  }

  const categoriaTipo = getCategoriasId(categoriaId);
  if (!categoriaTipo) {
    throw new BadRequestException(`Categoría inválida: ${categoriaId}`);
  }

  const inicio = new Date(anio, mes - 1, 1);
  const fin    = new Date(anio, mes, 1);

  const qb = this.entradaRepository
    .createQueryBuilder('e')
    .innerJoin('e.inventario', 'inv')
    .innerJoin('inv.producto', 'p')
    .leftJoin('inv.unidad_medida', 'um') 
    .where('e.fechaEntrada >= :inicio AND e.fechaEntrada < :fin', { inicio, fin })
    .andWhere('p.categoriaTipo = :categoriaTipo', { categoriaTipo })
    .select('e.id', 'entrada_id')
    .addSelect("DATE_FORMAT(e.fechaEntrada, '%Y-%m-%d %H:%i')", 'fecha_entrada') 
    .addSelect('e.cantidad', 'cantidad')
    .addSelect('p.codigo', 'codigo_producto')
    .addSelect('p.nombre', 'nombre')
    .addSelect('um.nombre', 'unidad_nombre')            
    .addSelect('um.abreviatura', 'unidad_abreviatura') 
    .orderBy('e.fechaEntrada', 'DESC')
    .addOrderBy('e.id', 'DESC');

  const total = await qb.clone().select('e.id').getCount();

  if (limit > 0) {
    const currentPage = page > 0 ? page : 1;
    qb.offset((currentPage - 1) * limit).limit(limit);
  }

  const raws = await qb.getRawMany<{
    entrada_id: number;
    fecha_entrada: string;
    cantidad: number;
    codigo_producto: string;
    nombre: string;
    unidad_nombre: string | null;
    unidad_abreviatura: string | null;
  }>();

  const data = raws.map(r => ({
    entrada_id: r.entrada_id,
    fecha: r.fecha_entrada,
    cantidad: r.cantidad,
    codigo_producto: r.codigo_producto,
    nombre: r.nombre,
    unidadMedida: (r.unidad_nombre || r.unidad_abreviatura)
      ? { nombre: r.unidad_nombre ?? '', abreviatura: r.unidad_abreviatura ?? '' }
      : null,
  }));

  return { data, total };
}


}
