// use-cases/get-salida.usecase.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Salida } from '../../entities/salida.entity';

@Injectable()
export class GetSalidaUseCase {
  constructor(
    @InjectRepository(Salida)
    private readonly salidaRepository: Repository<Salida>,
  ) {}

  async getSalidasPorMes(mes: number,anio: number,categoriaId: number,page = 1,limit = 0): Promise<{data: Array<{salida_id: number; fecha: string; cantidad: number; codigo_producto: string; nombre: string; unidadMedida: { nombre: string; abreviatura: string } | null;}>;total: number;}> {
  if (mes < 1 || mes > 12) throw new BadRequestException('Mes inválido (1-12)');
  if (anio < 2000 || anio > 2100) throw new BadRequestException('Año inválido');
  if (!categoriaId || Number.isNaN(+categoriaId)) {
    throw new BadRequestException('categoriaId es requerido');
  }

  const inicio = new Date(anio, mes - 1, 1);
  const fin    = new Date(anio, mes, 1);

  const qb = this.salidaRepository
    .createQueryBuilder('s')
    .innerJoin('s.inventario', 'inv')
    .innerJoin('inv.producto', 'p')
    .innerJoin('p.categoria', 'c')
    .leftJoin('inv.unidad_medida', 'um') 
    .where('s.fechaSalida >= :inicio AND s.fechaSalida < :fin', { inicio, fin })
    .andWhere('c.id = :categoriaId', { categoriaId })
    .select('s.id', 'salida_id')
    .addSelect("DATE_FORMAT(s.fechaSalida, '%Y-%m-%d')", 'fecha_salida')
    .addSelect('s.cantidad', 'cantidad')
    .addSelect('p.codigo', 'codigo_producto')
    .addSelect('p.nombre', 'nombre')
    .addSelect('um.nombre', 'unidad_nombre')           
    .addSelect('um.abreviatura', 'unidad_abreviatura') 
    .orderBy('s.fechaSalida', 'DESC')
    .addOrderBy('s.id', 'DESC');

  const total = await qb.clone().select('s.id').getCount();

  if (limit > 0) {
    const currentPage = page > 0 ? page : 1;
    qb.offset((currentPage - 1) * limit).limit(limit);
  }

  const raws = await qb.getRawMany<{
    salida_id: number;
    fecha_salida: string;
    cantidad: number;
    codigo_producto: string;
    nombre: string;
    unidad_nombre: string | null;
    unidad_abreviatura: string | null;
  }>();

  const data = raws.map(r => ({
    salida_id: r.salida_id,
    fecha: r.fecha_salida,
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
