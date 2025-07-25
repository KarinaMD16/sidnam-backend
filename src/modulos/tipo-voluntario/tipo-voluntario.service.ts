import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

import { tipoVoluntario } from './entities/tipo-voluntario.entity';
import { CreateTipoVoluntarioDto } from './dto/create-tipo-voluntario.dto';
import { ResponseTipoVoluntarioDto } from './dto/response-tipo-voluntario.dto';
import { UpdateTipoVoluntarioDto } from './dto/update-tipo-voluntario.dto';


@Injectable()
export class TipoVoluntarioService {
  constructor(
   
    @InjectRepository(tipoVoluntario)
    private readonly tipoVoluntarioRepo: Repository<tipoVoluntario>,

  ) {}


async create(data: CreateTipoVoluntarioDto): Promise<ResponseTipoVoluntarioDto> {
    
      const exists = await this.tipoVoluntarioRepo.findOneBy({
        tipoVoluntario: data.tipoVoluntario,
      })
      if (exists) {
        throw new ConflictException(`El tipo de voluntario ${data.tipoVoluntario} ya existe`);
      }
        const voluntario = this.tipoVoluntarioRepo.create(data);
        await this.tipoVoluntarioRepo.save(voluntario);

        return {
            tipoVoluntario: voluntario.tipoVoluntario,
        };
  }



  async findAll(): Promise<ResponseTipoVoluntarioDto[]> {
        const voluntario = await this.tipoVoluntarioRepo.find({
        });
        return voluntario.map((d) => ({
       tipoVoluntario: d.tipoVoluntario,
        }));
  }


async update(id: number, data: UpdateTipoVoluntarioDto) {
  const voluntario = await this.tipoVoluntarioRepo.findOneBy({ idTipoVoluntario: id });

  if (!voluntario) {
    throw new NotFoundException(`Voluntario con el ID ${id} no encontrado`);
  }

  const existente = await this.tipoVoluntarioRepo.findOne({
    where: {
      tipoVoluntario: data.tipoVoluntario,
      idTipoVoluntario: Not(id), 
    },
  });

  if (existente) {
    throw new ConflictException(`El tipo de voluntario ${data.tipoVoluntario} ya existe`);
  }


  if (voluntario.tipoVoluntario === data.tipoVoluntario) {
    return { message: 'No hay cambios para actualizar' };
  }


  await this.tipoVoluntarioRepo.update(id, data);

}



  async remove(id: number) {
        const voluntario = await this.tipoVoluntarioRepo.findOneBy({
          idTipoVoluntario: id
        });

        if (!voluntario) {
          throw new NotFoundException(`Voluntario con el ID ${id} no encontrado`);

        }
      await this.tipoVoluntarioRepo.remove(voluntario);
   }

}

