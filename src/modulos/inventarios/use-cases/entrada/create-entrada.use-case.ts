import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, HttpException } from '@nestjs/common';
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
        throw new BadRequestException(`Cantidad inválida para inventarioId ${p.inventarioId}. Debe ser mayor a 0`);
      }
    }

    
    const consolidados = entrada.productos.reduce((acc, p) => {
      acc[p.inventarioId] = (acc[p.inventarioId] ?? 0) + p.cantidad;
      return acc;
    }, {} as Record<number, number>);

    const uniqueIds = Object.keys(consolidados).map(Number);
    const ahora = new Date();

    try {
      return await this.dataSource.transaction(async (manager) => {
        const invRepo = manager.getRepository(Inventario);
        const entRepo = manager.getRepository(Entrada);

        
        const inventarios = await invRepo.findBy({ id: In(uniqueIds) });

        
        const encontrados = new Set(inventarios.map(i => i.id));
        const faltantes = uniqueIds.filter(id => !encontrados.has(id));
        if (faltantes.length > 0) {
          throw new NotFoundException(`Inventarios no encontrados: ${faltantes.join(', ')}`);
        }

        
        const entradas = uniqueIds.map((id) => {
          const inv = inventarios.find(x => x.id === id)!;
          return entRepo.create({
            cantidad: consolidados[id],
            fechaEntrada: ahora,
            inventario: inv,
          });
        });
        const guardadas = await entRepo.save(entradas);

        
        for (const id of uniqueIds) {
          await invRepo.increment({ id }, 'stock', consolidados[id]);
        }

        
        const stocksActuales = await invRepo.find({
          where: { id: In(uniqueIds) },
          select: { id: true, stock: true },
        });

        return {
          message: 'Entradas registradas correctamente',
          fecha: ahora,
          totalLineas: uniqueIds.length,
          entradas: guardadas.map(e => ({
            entradaId: e.id,
            inventarioId: e.inventario.id,
            cantidad: e.cantidad,
          })),
          inventarios: stocksActuales,
        };
      });
    } catch (err) {
      
      if (err instanceof HttpException) throw err;
      console.error('ERROR crearEntradas', err);
      throw new InternalServerErrorException('Error creando entradas');
    }
  }
}
