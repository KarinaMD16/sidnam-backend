import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getTipoUnidadMedidaById, TipoUnidadMedidaOptions } from 'src/common/enums/tipoUnidadMedida.enum';
import { Repository } from 'typeorm';
import { Unidad_Medida } from '../residentes/entities/unidadMedida.entity';
import { CreateUnidadMedidaDto } from '../residentes/dto/createUnidadMedidaDto';

@Injectable()
export class UnidadesMedidaService {


    constructor(
        @InjectRepository(Unidad_Medida)
        private readonly unidadMedidaRepository: Repository<Unidad_Medida>,
    ){}
    
    getTipoUnidadesMedida() {
        return TipoUnidadMedidaOptions.map(opt => ({
          id: opt.id,
          nombre: opt.nombre, 
        }));
    }

    async asociarUnidadATipo(idtipoMedicamento: number, createUnidadMedida: CreateUnidadMedidaDto){

    const tipo = getTipoUnidadMedidaById(idtipoMedicamento);

    if (!tipo) {
      throw new BadRequestException(
        'Tipo de unidad de medida con id ${ idtipoMedicamento } no es válido'
      );
    }

    const unidadMedida = this.unidadMedidaRepository.create({
      ...createUnidadMedida,
      tipo
    });

    return this.unidadMedidaRepository.save(unidadMedida);
  }
}
