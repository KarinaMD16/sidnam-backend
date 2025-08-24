import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Residente } from './entities/residente.entity';
import { In, Not, NumericType, Repository } from 'typeorm';
import { Expediente_Residente } from './entities/expedientes.entity';
import { Encargado } from './entities/encargado.entity';
import { CreateExpedienteCompletoDto } from './dto/createExpedienteResidenteDto';
import { getTipoPensionById, TipoPensionOptions } from 'src/common/enums/tipoPension.enum';
import { EstadoCivilOptios, getEstadoCivilById } from 'src/common/enums/estadoCivil.enum';
import { DependenciaOpts, getDependenciaById } from 'src/common/enums/dependencia.enum';
import { ExpedienteResidentePreviewDto } from './dto/getPreviewExpediente';
import { plainToInstance } from 'class-transformer';
import { GetExpedienteResidenteDto } from './dto/getExpedienteDto';
import { ActualizarExpediente } from './dto/actualizarExpediente';
import { CreatePatologiaDto } from './dto/createPatologia.Dto';
import { Patologias } from './entities/patologias.entity';
import { Tipo_MedicamentoDto } from './dto/createTipoMedicamento.Dto';
import { Tipo_medicamento } from './entities/tipo_medicamento.entity';
import { Medicamentos } from './entities/medicamento.entity';
import { TurnoOpts } from 'src/common/enums/turno.enum';


@Injectable()
export class ResidentesService {


    constructor(
        @InjectRepository(Residente)
        private readonly residenteRepository: Repository<Residente>,

        @InjectRepository(Expediente_Residente)
        private readonly expedienteResidenteRepository: Repository<Expediente_Residente>,

        @InjectRepository(Encargado)
        private readonly encargadoRepository: Repository<Encargado>,
        
        @InjectRepository(Patologias)
        private readonly patologiasRepository: Repository<Patologias>,

        @InjectRepository(Tipo_medicamento)
        private readonly tipoMedicamentoRepository: Repository<Tipo_medicamento>,

        @InjectRepository(Medicamentos)
        private readonly medicamentoRepository: Repository<Medicamentos>,
    ){}


  async createExpediente(createExpedienteDto: CreateExpedienteCompletoDto) {
 
    const residenteExistente = await this.residenteRepository.findOne({
      where: { cedula: createExpedienteDto.residente.cedula },
    });

    const encargadoExistente = await this.encargadoRepository.findOne({
      where: { cedula: createExpedienteDto.residente.encargados[0].cedula },
    });

    if(encargadoExistente) {
      throw new BadRequestException('El encargado ya existe');
    }

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

  async actualizarInformacionGeneralExpediente(idExpediente: number, actualizarExpediente: Partial<ActualizarExpediente>): Promise<{ message: string }> {
    const expediente = await this.expedienteResidenteRepository.findOne({
      where: { id_expediente: idExpediente },
      relations: ['residente', 'residente.encargados'],
    });

    if (!expediente) {
      throw new NotFoundException('Expediente no encontrado');
    }

    if (actualizarExpediente.cedula) {
      const cedulaExistenteResidente = await this.residenteRepository.findOne({
        where: {
          cedula: actualizarExpediente.cedula,
          id_adulto_mayor: Not(expediente.residente.id_adulto_mayor),
        },
      });

      if (cedulaExistenteResidente) {
        throw new BadRequestException('Cédula ya existe en otro residente');
      }

      const cedulaExistenteEncargado = await this.encargadoRepository.findOne({
        where: { cedula: actualizarExpediente.cedula },
      });

      if (cedulaExistenteEncargado) {
        throw new BadRequestException('Cédula ya existe en un encargado');
      }

      expediente.residente.cedula = actualizarExpediente.cedula;
    }

    if (actualizarExpediente.encargados && actualizarExpediente.encargados.length > 0) {
      for (const encargadoDto of actualizarExpediente.encargados) {
        if (encargadoDto.id) {
        
          const encargadoExistente = expediente.residente.encargados.find(e => e.id === encargadoDto.id);
          if (encargadoExistente) {
            if (encargadoDto.nombre !== undefined) encargadoExistente.nombre = encargadoDto.nombre;
            if (encargadoDto.apellido1 !== undefined) encargadoExistente.apellido1 = encargadoDto.apellido1;
            if (encargadoDto.apellido2 !== undefined) encargadoExistente.apellido2 = encargadoDto.apellido2;
            if (encargadoDto.telefono !== undefined) encargadoExistente.telefono = encargadoDto.telefono;
            if (encargadoDto.correo !== undefined) encargadoExistente.correo = encargadoDto.correo;

      
            if (encargadoDto.cedula !== undefined && encargadoDto.cedula !== encargadoExistente.cedula) {

              const cedulaExistenteEncargado = await this.encargadoRepository.findOne({
                where: { cedula: encargadoDto.cedula },
              });

              if (cedulaExistenteEncargado) {
                throw new BadRequestException('Cédula ya existe en otro encargado');
              }

              const cedulaExistenteResidente = await this.residenteRepository.findOne({
                where: { cedula: encargadoDto.cedula },
              });

              if (cedulaExistenteResidente) {
                throw new BadRequestException('Cédula ya existe en un residente');
              }

              encargadoExistente.cedula = encargadoDto.cedula;
            }

            await this.encargadoRepository.save(encargadoExistente);
          }
        } else {
          if (encargadoDto.cedula) {
            const cedulaExistenteEncargado = await this.encargadoRepository.findOne({
              where: { cedula: encargadoDto.cedula },
            });

            if (cedulaExistenteEncargado) {
              throw new BadRequestException('Cédula ya existe en otro encargado');
            }

            const cedulaExistenteResidente = await this.residenteRepository.findOne({
              where: { cedula: encargadoDto.cedula },
            });

            if (cedulaExistenteResidente) {
              throw new BadRequestException('Cédula ya existe en un residente');
            }
          }

          const nuevoEncargado = this.encargadoRepository.create({
            nombre: encargadoDto.nombre!,
            apellido1: encargadoDto.apellido1!,
            apellido2: encargadoDto.apellido2,
            cedula: encargadoDto.cedula,
            correo: encargadoDto.correo,
            telefono: encargadoDto.telefono,
            residentes: [expediente.residente],
          });

          await this.encargadoRepository.save(nuevoEncargado);

          expediente.residente.encargados.push(nuevoEncargado);
        }
      }
    }

    await this.residenteRepository.save(expediente.residente);
    await this.expedienteResidenteRepository.save(expediente);

    return { message: 'Información general del expediente actualizada correctamente' };
  }


  async createPatologia(createPatologiaDto: CreatePatologiaDto){
    const patologia = this.patologiasRepository.create(createPatologiaDto);
    await this.patologiasRepository.save(patologia);
    return "Patología creada correctamente";
  }

  async getPatologias(){
    return this.patologiasRepository.find();
  }

  async agregarPatologiaExpediente(id_expediente: number, id_patologia: number){

    const expediente = await this.expedienteResidenteRepository.findOne({
      where: {id_expediente: id_expediente},
      relations: ['patologias']
    })

    const patologia = await this.patologiasRepository.findOne({
      where: {id_patologia: id_patologia},
    })

    if(!expediente){
      throw new NotFoundException('Expediente no encontrado');
    }

    if(!patologia){
      throw new NotFoundException('Patología no encontrada');
    }

    expediente.patologias.push(patologia);
    await this.expedienteResidenteRepository.save(expediente);

    return "Patología agregada al expediente correctamente";
  }

  async crearTipoMedicamento(createTipoMedicamento: Tipo_MedicamentoDto){
    const nuevoTipoMedicamento = this.tipoMedicamentoRepository.create(createTipoMedicamento);
    await this.tipoMedicamentoRepository.save(nuevoTipoMedicamento);
    return "Tipo de medicamento creado correctamente";
  }

  async getTiposMedicamento(){
    return this.tipoMedicamentoRepository.find();
  }

  async asociarMedicamentoATipoMedicamento(idTipoMedicamento: number, nombreMedicamento: string){

    const tipoMedicamento = await this.tipoMedicamentoRepository.findOne({ where: {id_tipo_medicamento: idTipoMedicamento } });


    if (!tipoMedicamento) {
      throw new NotFoundException('Tipo de medicamento no encontrado');
    }


    const nombreMinuscula = nombreMedicamento.toLowerCase();

    const medicamentoExistente = await this.medicamentoRepository.findOne({
        where: { 
            nombre: nombreMinuscula, 
            tipo: { id_tipo_medicamento: idTipoMedicamento } 
        },
        relations: ['tipo'] 
    });

    if (medicamentoExistente) {
        throw new BadRequestException('El medicamento ya existe para este tipo');
    }
    const nuevoMedicamento = this.medicamentoRepository.create({ nombre: nombreMinuscula, tipo: tipoMedicamento });

    await this.medicamentoRepository.save(nuevoMedicamento);

    return "Medicamento asociado al tipo de medicamento correctamente";

  }

  async getMedicamentos(){
    return this.medicamentoRepository.find({
      relations: ['tipo']
    });
  }

  getTurnos() {
    return TurnoOpts.map(opt => ({
      id: opt.id,
      nombre: opt.nombre, 
    }));
  }

  

  




}


