// use-cases/entrada-medicamento/get-entrada-medicamento.use-case.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntradaMedicamento } from '../../entities/entradaMedicamento.entity';

@Injectable()
export class GetEntradaMedicamentoUseCase {
  constructor(
    @InjectRepository(EntradaMedicamento)
    private readonly entradaMedRepo: Repository<EntradaMedicamento>,
  ) {}

 
  async findAllEntradasMedicamentos(opts: {anio?: number; mes?: number; page?: number; limit?: number;}): Promise<{data: Array <{id: number; fecha: Date; cantidad: number; nombreMedicamento: string; nombreUnidad: string | null; abreviaturaUnidad: string | null;}>;total: number;}> {

  const page  = Number(opts.page ?? 1);
  const limit = Number(opts.limit ?? 0);

  if ((opts.anio && !opts.mes) || (!opts.anio && opts.mes)) {
    throw new BadRequestException('Si filtras por mes/año, debes enviar ambos (anio y mes).');
  }
  if (opts.mes && (opts.mes < 1 || opts.mes > 12)) {
    throw new BadRequestException('Mes inválido (1-12).');
  }

  const qb = this.entradaMedRepo
    .createQueryBuilder('em')
    .leftJoinAndSelect('em.medicamento', 'm')
    .leftJoinAndSelect('em.unidad_medida', 'um')
    .orderBy('em.fechaEntrada', 'DESC')
    .addOrderBy('em.id', 'DESC');

  
  if (opts.anio && opts.mes) {
    const inicio = new Date(opts.anio, opts.mes - 1, 1, 0, 0, 0, 0);
    const fin    = new Date(opts.anio, opts.mes, 1, 0, 0, 0, 0);
    qb.andWhere('em.fechaEntrada >= :inicio AND em.fechaEntrada < :fin', { inicio, fin });
  }

  
  if (limit > 0) {
    const safePage = page > 0 ? page : 1;
    qb.skip((safePage - 1) * limit).take(limit);
  }

  const [rows, total] = await qb.getManyAndCount();

  const data = rows.map(e => ({
    id: e.id,
    fecha: e.fechaEntrada,
    cantidad: e.cantidad,
    nombreMedicamento: e.medicamento?.nombre ?? '',
    nombreUnidad: e.unidad_medida?.nombre ?? null,
    abreviaturaUnidad: e.unidad_medida?.abreviatura ?? null,
  }));

  return { data, total };
 }

}
