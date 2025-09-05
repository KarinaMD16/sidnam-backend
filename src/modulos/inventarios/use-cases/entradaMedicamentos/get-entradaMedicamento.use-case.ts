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

 
  async findMany(opts: {
    anio?: number;
    mes?: number; 
    medicamentoId?: number;
    page?: number;
    limit?: number; 
  }): Promise<{
    data: Array<{
      id: number;
      fecha: Date;
      cantidad: number;
      medicamento: { id: number; nombre: string; tipo: string };
      unidad: { id: number; nombre: string; abreviatura: string };
    }>;
    total: number;
  }> {
    const { anio, mes, medicamentoId } = opts;
    const page  = Number(opts.page ?? 1);
    const limit = Number(opts.limit ?? 0);

    if ((anio && !mes) || (!anio && mes)) {
      throw new BadRequestException('Si filtras por mes/año, debes enviar ambos (anio y mes).');
    }
    if (mes && (mes < 1 || mes > 12)) {
      throw new BadRequestException('Mes inválido (1-12).');
    }

    const qb = this.entradaMedRepo
      .createQueryBuilder('em')
      .leftJoinAndSelect('em.medicamento', 'm')
      .leftJoinAndSelect('em.unidad_medida', 'um')
      .orderBy('em.fechaEntrada', 'DESC')
      .addOrderBy('em.id', 'DESC');

   
    if (anio && mes) {
      
      const inicio = new Date(anio, mes - 1, 1, 0, 0, 0, 0);
      const fin    = new Date(anio, mes, 1, 0, 0, 0, 0);
      qb.andWhere('em.fechaEntrada >= :inicio AND em.fechaEntrada < :fin', { inicio, fin });
    }

    
    if (medicamentoId) {
      qb.andWhere('m.id_medicamento = :medicamentoId', { medicamentoId });
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
      medicamento: {
        id: e.medicamento.id_medicamento,
        nombre: e.medicamento.nombre,
        tipo: e.medicamento.tipo,
      },
      unidad: {
        id: e.unidad_medida.id_unidad,
        nombre: e.unidad_medida.nombre,
        abreviatura: e.unidad_medida.abreviatura,
      },
    }));

    return { data, total };
  }
}
