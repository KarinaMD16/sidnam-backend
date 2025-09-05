// use-cases/entrada-medicamento/create-entrada-medicamento.use-case.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, In } from 'typeorm';
import { EntradaMedicamento } from '../../entities/entradaMedicamento.entity';
import { Unidad_Medida } from 'src/modulos/unidades-medida/entities/unidadMedida.entity';
import { Medicamentos } from 'src/modulos/residentes/entities/medicamento.entity';
import { CrearEntradaMedicamentoDto } from '../../dto/crearEntradaMedicamentosDto';

@Injectable()
export class CreateEntradaMedicamentoUseCase {
  constructor(private readonly ds: DataSource) {}

  async crearEntradaMedicamento(dto: CrearEntradaMedicamentoDto) {
    
    if (!dto.items?.length) {
      throw new BadRequestException('Debe incluir al menos un item');
    }
    for (const it of dto.items) {
      if (it.medicamentoId == null || it.unidadMedidaId == null) {
        throw new BadRequestException('Cada item debe incluir medicamentoId y unidadMedidaId');
      }
      if (Number(it.cantidad) <= 0) {
        throw new BadRequestException(
          `Cantidad inválida para medicamentoId ${it.medicamentoId}. Debe ser mayor que 0`,
        );
      }
    }

    return this.ds.transaction(async (manager) => {
     
      const medIds = [...new Set(dto.items.map(i => i.medicamentoId))];
      const umIds  = [...new Set(dto.items.map(i => i.unidadMedidaId))];

      const meds = await manager.find(Medicamentos, { where: { id_medicamento: In(medIds) } });
      const ums  = await manager.find(Unidad_Medida, { where: { id_unidad: In(umIds) } });

      const medSet = new Set(meds.map(m => m.id_medicamento));
      const umSet  = new Set(ums.map(u => u.id_unidad));

      const faltanMeds = medIds.filter(id => !medSet.has(id));
      const faltanUms  = umIds.filter(id => !umSet.has(id));

      if (faltanMeds.length) throw new NotFoundException(`Medicamentos no encontrados: ${faltanMeds.join(', ')}`);
      if (faltanUms.length)  throw new NotFoundException(`Unidades de medida no encontradas: ${faltanUms.join(', ')}`);

      
      const ahora = new Date();
      const aGuardar = dto.items.map(it => {
        const medicamento = meds.find(m => m.id_medicamento === it.medicamentoId)!;
        const unidad      = ums.find(u => u.id_unidad === it.unidadMedidaId)!;

        return manager.create(EntradaMedicamento, {
          medicamento,
          unidad_medida: unidad,
          cantidad: Number(it.cantidad),
          fechaEntrada: ahora,            
        });
      });

      const guardadas = await manager.save(EntradaMedicamento, aGuardar);

      
      const ids = guardadas.map(g => g.id);
      const completas = await manager.find(EntradaMedicamento, {
        where: { id: In(ids) },
        relations: { medicamento: true, unidad_medida: true },
        order: { id: 'ASC' },
      });

      
      const data = completas.map(e => ({
        id: e.id,
        fecha: e.fechaEntrada,
        cantidad: e.cantidad,
        medicamento: {
          id: e.medicamento.id_medicamento,
          nombre: e.medicamento.nombre,
        },
        unidad: {
          id: e.unidad_medida.id_unidad,
          nombre: e.unidad_medida.nombre,
          abreviatura: e.unidad_medida.abreviatura,
        },
      }));

      return {
        message: 'Entradas de medicamentos registradas correctamente',
        total: data.length,
        data,
      };
    });
  }
}
