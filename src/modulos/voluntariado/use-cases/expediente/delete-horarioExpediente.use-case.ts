// use-cases/update-expediente.use-case.ts
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Horario } from '../../entities/horario.entity';


@Injectable()
export class DeleteExpediente {
  constructor(
    @InjectRepository(Horario)
    private readonly horarios: Repository<Horario>,
           

  ) {}


  async deleteHorario(idHorario: number): Promise<{message: string}>{

    const horarioEliminado = await this.horarios.findOne({
        where: {id: idHorario}
    })

    if(!horarioEliminado){
        throw new NotFoundException('Horario no encontrado')
    }

    await this.horarios.remove(horarioEliminado)

    return {message: 'Horario eliminado correctamente'}
  }
}
