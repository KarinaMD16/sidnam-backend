import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Residente } from './entities/residente.entity';
import { Repository } from 'typeorm';
import { Expediente_Residente } from './entities/expedientes.entity';
import { Encargado } from './entities/encargado.entity';
import { CreateExpedienteCompletoDto } from './dto/createExpedienteResidenteDto';

@Injectable()
export class ResidentesService {


    constructor(
        @InjectRepository(Residente)
        private readonly residenteRepository: Repository<Residente>,

        @InjectRepository(Expediente_Residente)
        private readonly expedienteResidenteRepository: Repository<Expediente_Residente>,

        @InjectRepository(Encargado)
        private readonly encargadoRepository: Repository<Encargado>,
    ){}


  async createExpediente(createExpedienteDto: CreateExpedienteCompletoDto) {
 
    const residenteExistente = await this.residenteRepository.findOne({
      where: { cedula: createExpedienteDto.residente.cedula },
    });

    if (residenteExistente) {
      throw new BadRequestException('El residente ya existe');
    }

    const encargados = await Promise.all(
      createExpedienteDto.residente.encargados.map(async enc => {
        let encargado = await this.encargadoRepository.findOneBy({ correo: enc.correo });
        if (!encargado) {
          encargado = this.encargadoRepository.create(enc);
          await this.encargadoRepository.save(encargado);
        }
        return encargado;
      }),
    );

    const residente = this.residenteRepository.create({
      ...createExpedienteDto.residente,
      encargados,
    });
    await this.residenteRepository.save(residente);

    const { tipo_pension, fecha_ingreso} = createExpedienteDto;
    const expediente = this.expedienteResidenteRepository.create({
      tipo_pension,
      fecha_ingreso,
      residente, 
    });

    return await this.expedienteResidenteRepository.save(expediente);
  }


}
