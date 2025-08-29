// use-cases/create-entrada.usecase.ts
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Inventario } from '../../entities/inventario.entity';
import { Entrada } from '../../entities/entrada.entity';
import { CrearEntradaLoteDto } from '../../dto/crearEntradaDto';

export class CreateEntradaUseCase {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(Inventario)
    private readonly inventarioRepository: Repository<Inventario>,

    @InjectRepository(Entrada)
    private readonly entradaRepository: Repository<Entrada>,
  ) {}

  async crearEntradasLote(dto: CrearEntradaLoteDto) {
    if (!dto.productos?.length) throw new NotFoundException('No se enviaron items');

    const loteId = randomUUID();
    const now = new Date();

    return this.dataSource.transaction(async (manager) => {
      // 1) Traer inventarios involucrados
      const ids = dto.productos.map(i => i.inventarioId);
      const inventarios = await manager.find(Inventario, { where: { id: In(ids) } });
      if (inventarios.length !== ids.length) {
        throw new NotFoundException('Alguno de los inventarios no existe');
      }

      // 2) Crear entradas (una por item del lote)
      const entradas = dto.productos.map(i => {
        const inv = inventarios.find(x => x.id === i.inventarioId)!;
        return manager.create(Entrada, {
          cantidad: i.cantidad,
          fechaEntrada: now,
          loteId,
          inventario: inv,
        });
      });
      const guardadas = await manager.save(Entrada, entradas);

      // 3) Actualizar stock (suma) de forma atómica
      for (const i of dto.productos) {
        await manager.increment(Inventario, { id: i.inventarioId }, 'stock', i.cantidad);
      }

      // 4) Respuesta
      const stocks = await manager.find(Inventario, {
        where: { id: In(ids) },
        select: { id: true, stock: true },
      });

      return {
        message: 'Entradas registradas',
        loteId,
        fecha: now,
        totalItems: dto.productos.length,
        entradas: guardadas.map(e => ({ entradaId: e.id, inventarioId: e.inventario.id })),
        inventarios: stocks, // [{ id, stock }]
      };
    });
  }
}
