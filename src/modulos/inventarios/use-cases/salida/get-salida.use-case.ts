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

  async getSalidasPorMes(
    mes: number,
    anio: number,
    page = 1,
    limit = 0,
  ): Promise<{
    data: Array<{
      salida_id: number;
      fecha_salida: string;  
      cantidad: number;
      codigo_producto: string;
      nombre: string;
    }>;
    total: number;
  }> {
   
    if (mes < 1 || mes > 12) throw new BadRequestException('Mes inválido (1-12)');
    if (anio < 2000 || anio > 2100) throw new BadRequestException('Año inválido');

    
    const inicio = new Date(anio, mes - 1, 1);
    const fin    = new Date(anio, mes, 1);

    const qb = this.salidaRepository
      .createQueryBuilder('s')
      .innerJoin('s.inventario', 'inv')
      .innerJoin('inv.producto', 'p')
      .where('s.fechaSalida >= :inicio AND s.fechaSalida < :fin', { inicio, fin })
      .select('s.id', 'salida_id')
      .addSelect("DATE_FORMAT(s.fechaSalida, '%Y-%m-%d')", 'fecha_salida')
      .addSelect('s.cantidad', 'cantidad')
      .addSelect('p.codigo', 'codigo_producto')
      .addSelect('p.nombre', 'nombre')
      .orderBy('s.fechaSalida', 'DESC')
      .addOrderBy('s.id', 'DESC');

   
    const total = await qb.clone().select('s.id').getCount();

    if (limit > 0) {
      const currentPage = page > 0 ? page : 1;
      qb.offset((currentPage - 1) * limit).limit(limit);
    }

    const rows = await qb.getRawMany<{
      salida_id: number;
      fecha_salida: string;
      cantidad: number;
      codigo_producto: string;
      nombre: string;
    }>();

    return { data: rows, total };
  }
}
