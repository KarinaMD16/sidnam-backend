// use-cases/update-expediente.use-case.ts
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Horario } from '../../entities/horario.entity';
import { Actividades } from '../../entities/actividades.entity';


@Injectable()
export class DeleteExpediente {
  constructor(
    @InjectRepository(Horario)
    private readonly horarioRepository: Repository<Horario>,

    @InjectRepository(Actividades)
    private readonly actividadRepository: Repository<Actividades>,
  ) {}


  async deleteHorario(idHorario: number): Promise<{message: string}>{

    const horarioEliminado = await this.horarioRepository.findOne({
        where: {id: idHorario}
    })

    if(!horarioEliminado){
        throw new NotFoundException('Horario no encontrado')
    }

    await this.horarioRepository.remove(horarioEliminado)

    return {message: 'Horario eliminado correctamente'}
  }

  async deleteActividad(idActividad: number): Promise<{message: string}> {

    const actividadEliminada = await this.actividadRepository.findOne({
        where: {id: idActividad}
    })

    if(!actividadEliminada){
        throw new NotFoundException('Actividad no encontrada')
    }

    await this.actividadRepository.remove(actividadEliminada)

    return {message: 'Actividad eliminada correctamente'}
  }
}
