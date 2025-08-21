import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Residente } from './entities/residente.entity';
import { NumericType, Repository } from 'typeorm';
import { Expediente_Residente } from './entities/expedientes.entity';
import { Encargado } from './entities/encargado.entity';
import { CreateExpedienteCompletoDto } from './dto/createExpedienteResidenteDto';
import { TipoPensionOptions } from 'src/common/enums/tipoPension.enum';
import { EstadoCivilOptios } from 'src/common/enums/estadoCivil.enum';
import { DependenciaOpts } from 'src/common/enums/dependencia.enum';
import { ExpedientePreviewDto } from '../voluntariado/dto/expedientePreviewDto';
import { ExpedienteResidentePreviewDto } from './dto/getPreviewExpediente';
import { plainToInstance } from 'class-transformer';
import { GetExpedienteResidenteDto } from './dto/getExpedienteDto';
import { normalize } from 'src/common/utils/normalize';

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

    const tipoPensionSeleccionado = TipoPensionOptions.find(opt => opt.id === createExpedienteDto.tipo_pension);
    if (!tipoPensionSeleccionado) {
      throw new BadRequestException('Tipo de pensión inválido');
    }

    const estadoCivilSeleccionado = EstadoCivilOptios.find(opt => opt.id === createExpedienteDto.residente.estado_civil);
    if (!estadoCivilSeleccionado) {
      throw new BadRequestException('Estado civil inválido');
    }

    const dependencia = DependenciaOpts.find(opt => opt.id === createExpedienteDto.residente.dependencia);
    if (!dependencia) {
      throw new BadRequestException('Dependencia inválida');
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
      estado_civil: EstadoCivilOptios.find(opt => opt.id === createExpedienteDto.residente.estado_civil)?.value,
      dependencia: DependenciaOpts.find(opt => opt.id === createExpedienteDto.residente.dependencia)?.value,
      encargados,
    });
    await this.residenteRepository.save(residente);

    const { fecha_ingreso} = createExpedienteDto;
    const expediente = this.expedienteResidenteRepository.create({
      tipo_pension: tipoPensionSeleccionado.value,
      fecha_ingreso,
      residente, 
    });

    return await this.expedienteResidenteRepository.save(expediente);
  }


  getTiposPension() {
    return TipoPensionOptions.map(opt => ({
      id: opt.id,
      nombre: opt.nombre, 
    }));
  }

  getDependencia() {
    return DependenciaOpts.map(opt => ({
      id: opt.id,
      nombre: opt.nombre, 
    }));
  }

  getEstadoCivil() {
    return EstadoCivilOptios.map(opt => ({
      id: opt.id,
      nombre: opt.nombre, 
    }));
  }

  async findAllPreviewsExpedientes(page?: number, limit?: number): Promise<{ data: ExpedienteResidentePreviewDto[]; total: number }> {
      const [data, total] = await this.expedienteResidenteRepository.findAndCount({
          skip: page && limit ? (page - 1) * limit : 0,
          take: limit,
          order: { id_expediente: 'DESC' },
          relations: ['residente', 'residente.encargados'],
      });
      
      const dtos = plainToInstance(ExpedienteResidentePreviewDto, data, { excludeExtraneousValues: true });
      
      return { data: dtos, total };
  }


  async findExpedienteById(idExpediente: number): Promise<GetExpedienteResidenteDto> {

    const expediente = await this.expedienteResidenteRepository.findOne({
      where: {id_expediente: idExpediente},
      relations: ['residente', 'residente.encargados'],
    })

    if(!expediente){
      throw new NotFoundException('Expediente no encontrado');
    }

    const dtos = plainToInstance(GetExpedienteResidenteDto, expediente, { excludeExtraneousValues: true });

    return dtos;
  }

  async findPreviewExpedienteByCedula(cedula: string): Promise<ExpedienteResidentePreviewDto>{

    const expediente = await this.expedienteResidenteRepository.findOne({
      where: {residente: {cedula: cedula}},
      relations: ['residente'],
    })

    if(!cedula){
      throw new BadRequestException('Cédula es requerida');
    }

    if(!expediente){
      throw new NotFoundException('Expediente no encontrado');
    }

    return plainToInstance(ExpedienteResidentePreviewDto, expediente, { excludeExtraneousValues: true });

  }

  async findPreviewsExpedientesByNombre(
  nombre: string,
): Promise<ExpedienteResidentePreviewDto[]> {
  if (!nombre) {
    throw new BadRequestException('El nombre es requerido');
  }

  // Normaliza el nombre buscado (quita tildes, espacios y pasa a minúsculas)
  const normalizeString = (str: string) =>
    str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // quita tildes
      .replace(/\s+/g, '') // quita espacios
      .toLowerCase();

  const nombreBuscado = normalizeString(nombre);

  // Consulta en MySQL ignorando tildes/mayúsculas con COLLATE
  const expedientes = await this.expedienteResidenteRepository
    .createQueryBuilder('expediente')
    .leftJoinAndSelect('expediente.residente', 'residente')
    .leftJoinAndSelect('residente.encargados', 'encargados')
    .where(
      `REPLACE(residente.nombre COLLATE utf8mb4_0900_ai_ci, ' ', '') LIKE :nombre`,
      { nombre: `%${nombreBuscado}%` },
    )
    .getMany();

  if (expedientes.length === 0) {
    throw new NotFoundException('No se encontraron expedientes con ese nombre');
  }

  return expedientes.map((exp) =>
    plainToInstance(ExpedienteResidentePreviewDto, exp, {
      excludeExtraneousValues: true,
    }),
  );
}






  
}
