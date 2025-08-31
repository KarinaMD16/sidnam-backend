// use-cases/create-entrada.usecase.ts
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DataSource, In } from 'typeorm';
import { Inventario } from '../../entities/inventario.entity';
import { Entrada } from '../../entities/entrada.entity';
import { CrearEntradaDto } from '../../dto/crearEntradaDto';

@Injectable()
export class CreateEntradaUseCase {

  constructor(private readonly dataSource: DataSource) {}

  async crearEntradas(entrada: CrearEntradaDto) {
    if (!entrada.productos?.length) {
      throw new BadRequestException('Se requiere al menos un producto');
    }

    for (const p of entrada.productos) {
    if (p.cantidad <= 0) {
      throw new BadRequestException(
        `Cantidad inválida para inventarioId ${p.inventarioId}. Debe ser mayor a 0`,
      );
    }
  }
    const ahora = new Date();

    try {
      return await this.dataSource.transaction(async (manager) => {
        const invRepo = manager.getRepository(Inventario);
        const entRepo = manager.getRepository(Entrada);

        // 1) Traer inventarios involucrados
        const ids = entrada.productos.map(p => p.inventarioId);
        const inventarios = await invRepo.find({ where: { id: In(ids) } });

        if (inventarios.length !== ids.length) {
          const existentes = new Set(inventarios.map(i => i.id));
          const faltantes = ids.filter(id => !existentes.has(id));
          throw new NotFoundException(`Inventarios no encontrados: ${faltantes.join(', ')}`);
        }

        // 2) Crear entradas
        const entradas = entrada.productos.map(p => {
          const inv = inventarios.find(x => x.id === p.inventarioId)!;
          return entRepo.create({
            cantidad: p.cantidad,
            fechaEntrada: ahora,
            inventario: inv,
          });
        });
        const guardadas = await entRepo.save(entradas);

        // 3) Sumar stock
        for (const p of entrada.productos) {
          await invRepo.increment({ id: p.inventarioId }, 'stock', p.cantidad);
        }

        // 4) Resumen
        const stocksActuales = await invRepo.find({
          where: { id: In(ids) },
          select: { id: true, stock: true },
        });

        return {
          message: 'Entradas registradas correctamente',
          fecha: ahora,
          totalProductos: entrada.productos.length,
          entradas: guardadas.map(e => ({
            entradaId: e.id,
            inventarioId: e.inventario.id,
            cantidad: e.cantidad,
          })),
          inventarios: stocksActuales,
        };
      });
    } catch (err: any) {
      console.error('ERROR crearEntradas', err);
      throw new InternalServerErrorException(err?.message ?? 'Error creando entradas');
    }
  }
}
