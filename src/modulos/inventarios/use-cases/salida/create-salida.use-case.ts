import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Inventario } from '../../entities/inventario.entity';
import { Salida } from '../../entities/salida.entity';
import { CrearSalidaDto } from '../../dto/crearSalidaDto';

@Injectable()
export class CreateSalidaUseCase {

  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Inventario) 
    private readonly inventarioRepo: Repository<Inventario>,

    @InjectRepository(Salida)     
    private readonly salidaRepo: Repository<Salida>,
    
  ) {}

  async crearSalidas(dto: CrearSalidaDto) {
    if (!dto.productos?.length) {
      throw new BadRequestException('Se requiere al menos un producto en la salida');
    }

    
    const porInv = new Map<number, number>();
    for (const item of dto.productos) {
      porInv.set(item.inventarioId, (porInv.get(item.inventarioId) ?? 0) + item.cantidad);
    }

    const ahora = new Date();

    return this.dataSource.transaction(async (manager) => {
      const ids = [...porInv.keys()];

      
      const inventarios = await manager.find(Inventario, {
        where: { id: In(ids) },
        relations: { producto: true },
        select: {
          id: true,
          stock: true,
          producto: { id: true, archivado: true, nombre: true, codigo: true },
        },
      });

      if (inventarios.length !== ids.length) {
        const existentes = new Set(inventarios.map(i => i.id));
        const faltantes = ids.filter(id => !existentes.has(id));
        throw new NotFoundException(`Inventarios no encontrados: ${faltantes.join(', ')}`);
      }

      
      for (const inv of inventarios) {
        if (inv.producto?.archivado) {
          throw new BadRequestException(
            `No se pueden registrar salidas del producto archivado (inventario ${inv.id}).`
          );
        }

        const requerida = porInv.get(inv.id)!;
        if (requerida > inv.stock) {
          throw new BadRequestException(
            `Stock insuficiente en inventario ${inv.id} (stock: ${inv.stock}, solicitado: ${requerida}).`
          );
        }
      }

      
      const salidas = dto.productos.map(p =>
        manager.create(Salida, {
          fechaSalida: ahora,
          cantidad: p.cantidad,
          inventario: { id: p.inventarioId } as Inventario,
        }),
      );
      const guardadas = await manager.save(Salida, salidas);

      
      for (const [inventarioId, totalCantidad] of porInv.entries()) {
        await manager.decrement(Inventario, { id: inventarioId }, 'stock', totalCantidad);
      }

      
      const stocksActuales = await manager.find(Inventario, {
        where: { id: In(ids) },
        select: { id: true, stock: true },
      });

      return {
        message: 'Salidas registradas correctamente',
        fecha: ahora,
        totalProductos: dto.productos.length,
        inventariosAfectados: porInv.size,
        salidas: guardadas.map(s => ({
          salidaId: s.id,
          inventarioId: s.inventario.id,
          cantidad: s.cantidad,
        })),
        inventarios: stocksActuales,
      };
    });
  }
}
