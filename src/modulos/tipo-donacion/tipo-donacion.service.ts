import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { tipoDonacion } from './entities/tipo-donacion.entity';
import { CreateTipoDonacionDto } from './dto/create-tipo-donacion.dto';
import { ResponseTipoDonacionDto } from './dto/response-tipo-donacion.dto';
import { UpdateTipoDonacionDto } from './dto/update-tipo-donacion.dto';


@Injectable()
export class TipoDonacionService {
  constructor(
   
    @InjectRepository(tipoDonacion)
    private readonly tipoDonacionRepo: Repository<tipoDonacion>,

  ) {}


async create(data: CreateTipoDonacionDto): Promise<ResponseTipoDonacionDto> {
    
      const exists = await this.tipoDonacionRepo.findOneBy({
        tipoDonacion: data.tipoDonacion,
      })
      if (exists) {
        throw new ConflictException(`El tipo de donación ${data.tipoDonacion} ya existe`);
      }
        const donacion = this.tipoDonacionRepo.create(data);
        await this.tipoDonacionRepo.save(donacion);

        return {
            tipoDonacion: donacion.tipoDonacion,
        };
  }



  async findAll(): Promise<ResponseTipoDonacionDto[]> {
        const donacion = await this.tipoDonacionRepo.find({
          order: { tipoDonacion: 'ASC' },
        });
        return donacion.map((d) => ({
       tipoDonacion: d.tipoDonacion,
        }));
  }


  async update(id: number, data: UpdateTipoDonacionDto) {

      const donacion = await this.tipoDonacionRepo.findOneBy({ 
        idTipo: id 
      });

      if (!donacion) {
        throw new NotFoundException(`Donación con el ID ${id} no encontrado`);
      }

      Object.assign(donacion, data);
      await this.tipoDonacionRepo.save(donacion);
  }



  async remove(id: number) {
        const donacion = await this.tipoDonacionRepo.findOneBy({
          idTipo: id
        });

        if (!donacion) {
          throw new NotFoundException(`Donación con el ID ${id} no encontrado`);

        }
      await this.tipoDonacionRepo.remove(donacion);
   }

}

