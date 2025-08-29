import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Residente } from './entities/residente.entity';
import { In, IsNull, Not, Repository } from 'typeorm';
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
import { Turno, TurnoOpts } from 'src/common/enums/turno.enum';
import { NotaEnfermeria } from './entities/NotaEnfermeria.entity';
import { formatFecha } from 'src/common/utils/fechaFormato';
import { ExpedienteEnfermeriaDto } from './dto/mostrarEnfermeriaDto';
import { CreateCuracionDto } from './dto/createCuracionDto';
import { Curaciones } from './entities/curaciones.entity';
import { Consulta_Ebais } from './entities/consultaEbais.entity';
import { createConsultaEbaisDto } from './dto/createConsultaEabisDto';
import { createTipoConsultaDto } from './dto/createTipoConsultaDto';
import { Tipo_Consulta } from './entities/tipoConsulta.entity';
import { CreateConsultaEspecialista } from './dto/createConsultaEspecialistaDto';
import { Consulta_Especialista } from './entities/consultaEspecialista.entity';
import { Bitacoras, BitacorasOpts } from 'src/common/enums/bitacaras.enum';
import { MostrarConsultaEspecialistaDto } from './dto/mostrarConsultaEspecialistaDto';
import { MostrarCuracionDto } from './dto/mostrarCuracionDto';
import { MostrarConsultaEbais } from './dto/mostrarConsultasEbaisDto';
import { Unidad_Medida } from './entities/unidadMedida.entity';
import { CreateUnidadMedidaDto } from './dto/createUnidadMedidaDto';
import { CreateAdministracionDto } from './dto/registrarMedicamentoDto';
import { Administraciones } from './entities/administraciones.entity';


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

        @InjectRepository(NotaEnfermeria)
        private readonly notaEnfermeriaRepository: Repository<NotaEnfermeria>,
        
        @InjectRepository(Curaciones)
        private readonly curacionesRepository: Repository<Curaciones>,

        @InjectRepository(Consulta_Ebais)
        private readonly consultaEbaisRepository: Repository<Consulta_Ebais>,

        @InjectRepository(Tipo_Consulta)
        private readonly tipoConsultaRepository: Repository<Tipo_Consulta>,

        @InjectRepository(Consulta_Especialista)
        private readonly consultaEspecialistaRepository: Repository<Consulta_Especialista>,

        @InjectRepository(Unidad_Medida)
        private readonly unidadMedidaRepository: Repository<Unidad_Medida>,

        @InjectRepository(Administraciones)
        private readonly administracionRepository: Repository<Administraciones>
    ){}

     private MAX_SEGMENT_LENGTH = 1000;


  async createExpediente(createExpedienteDto: CreateExpedienteCompletoDto) {
 
      const residenteExistente = await this.residenteRepository.findOne({
        where: { cedula: createExpedienteDto.residente.cedula },
      });
      

      if (createExpedienteDto.residente.encargados.some(enc => enc.cedula === createExpedienteDto.residente.cedula)) {
        throw new BadRequestException('La cédula del residente no puede ser la misma que la de un encargado');
      }

      const encargadosCedulas = createExpedienteDto.residente.encargados.map(enc => enc.cedula);
      
      const cedulasDuplicadas = encargadosCedulas.filter(
        (cedula, index) => encargadosCedulas.indexOf(cedula) !== index
      );

      if (cedulasDuplicadas.length > 0) {
        throw new BadRequestException(
          `Hay cédulas repetidas en los encargados: ${[...new Set(cedulasDuplicadas)].join(', ')}`
        );
      }

      for (const encargadoDto of createExpedienteDto.residente.encargados) {
        
        const residenteExistente = await this.residenteRepository.findOne({
          where: { cedula: encargadoDto.cedula },
        });

        if (residenteExistente) {
          throw new BadRequestException(
            `La cédula ${encargadoDto.cedula} ya existe en un residente`
          );
      }
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

    const encargados: Encargado[] = [];
    for (const enc of createExpedienteDto.residente.encargados) {
      let encargado = await this.encargadoRepository.findOne({ where: { cedula: enc.cedula } });

      if (!encargado) {
        encargado = this.encargadoRepository.create(enc);
        await this.encargadoRepository.save(encargado);
      }

      encargados.push(encargado);
    }


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

    if (actualizarExpediente.cedula &&actualizarExpediente.encargados?.some(enc => enc.cedula === actualizarExpediente.cedula)) {
      throw new BadRequestException(
        'La cédula del residente no puede coincidir con la de ningún encargado enviado'
      );
    }

    if (actualizarExpediente.estado_civil !== undefined) {
      const estadoCivilEnum = getEstadoCivilById(actualizarExpediente.estado_civil);

      if (!estadoCivilEnum) {
        throw new BadRequestException(
          'Estado civil con id ${ actualizarExpediente.estado_civil } no es válido'
        );
      }

      expediente.residente.estado_civil = estadoCivilEnum;
    }

    if(actualizarExpediente.fecha_nacimiento){
      expediente.residente.fecha_nacimiento = actualizarExpediente.fecha_nacimiento;
    }

    if (actualizarExpediente.correo) {
      expediente.residente.email = actualizarExpediente.correo;
    }

    if (actualizarExpediente.fecha_ingreso) {
      expediente.fecha_ingreso = actualizarExpediente.fecha_ingreso;
    }

    if(actualizarExpediente.edad){
      expediente.residente.edad = actualizarExpediente.edad;
    }
    
    if (actualizarExpediente.nombre) {
      expediente.residente.nombre = actualizarExpediente.nombre;
    }

    if (actualizarExpediente.tipo_pension !== undefined) {
      const estadoCivilEnum = getTipoPensionById(actualizarExpediente.tipo_pension);

      if (!estadoCivilEnum) {
        throw new BadRequestException(
          'Estado civil con id ${ actualizarExpediente.estado_civil } no es válido'
        );
      }

      expediente.tipo_pension = estadoCivilEnum;
    }


    if (actualizarExpediente.dependencia !== undefined) {
      const estadoCivilEnum = getDependenciaById(actualizarExpediente.dependencia);

      if (!estadoCivilEnum) {
        throw new BadRequestException(
          'Estado civil con id ${ actualizarExpediente.estado_civil } no es válido'
        );
      }

      expediente.residente.dependencia = estadoCivilEnum;
    }

    if(actualizarExpediente.sexo){
      expediente.residente.sexo = actualizarExpediente.sexo;
    }

    if (actualizarExpediente.cedula) {
      const cedulaExistenteResidente = await this.residenteRepository.findOne({
        where: {
          cedula: actualizarExpediente.cedula,
          id_adulto_mayor: Not(expediente.residente.id_adulto_mayor),
        },
      });

      if (cedulaExistenteResidente) {
        throw new BadRequestException(`La cédula ${actualizarExpediente.cedula} ya existe en un residente`);
      }

      const cedulaExistenteEncargado = await this.encargadoRepository.findOne({
        where: { cedula: actualizarExpediente.cedula },
      });

      if (cedulaExistenteEncargado) {
        throw new BadRequestException(`La cédula ${actualizarExpediente.cedula} ya existe en un encargado`);
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

  async createPatologia(createPatologiaDto: CreatePatologiaDto) {
    const patologia = this.patologiasRepository.create({
      ...createPatologiaDto,
      nombre: createPatologiaDto.nombre.toLowerCase(),
    });

    await this.patologiasRepository.save(patologia);
    return "Patología creada correctamente";
  }

  async getPatologias() {
    const patologias = await this.patologiasRepository.find();

    return patologias.map(p => ({
      ...p,
      nombre: p.nombre.charAt(0).toUpperCase() + p.nombre.slice(1).toLowerCase(),
    }));
  }

  async agregarPatologiaExpediente(id_expediente: number, id_patologia: number){

    const expediente = await this.expedienteResidenteRepository.findOne({
      where: {id_expediente: id_expediente},
      relations: ['patologias']
    })

    const patologia = await this.patologiasRepository.findOne({
      where: {id_patologia: id_patologia},
    })

    if(expediente?.patologias.some(p => p.id_patologia === id_patologia)){
      throw new BadRequestException('Patología ya existe en el expediente');
    }

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

  async eliminarPatologia(id_expediente: number, id_patologia: number){

    const expediente = await this.expedienteResidenteRepository.findOne({
      where: {id_expediente: id_expediente},
      relations: ['patologias']
    })

    if(!expediente){
      throw new NotFoundException('Expediente no encontrado');
    }

    const patologia = await this.patologiasRepository.findOne({
      where: {id_patologia: id_patologia},
    })

    if(!patologia){
      throw new NotFoundException('Patología no encontrada');
    }

    expediente.patologias = expediente.patologias.filter(p => p.id_patologia !== id_patologia);
    await this.expedienteResidenteRepository.save(expediente);

    await this.expedienteResidenteRepository.save(expediente);
    return expediente.patologias;
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

  async crearNotaEnfermeria(expedienteId: number, textoCompleto: string, titulo?: string): Promise<NotaEnfermeria> {
    const expediente = await this.expedienteResidenteRepository.findOne({
        where: { id_expediente: expedienteId },
    });

    if (!expediente) {
        throw new NotFoundException('Expediente no encontrado');
    }

    let notaPadre: NotaEnfermeria | undefined = undefined;
    let primeraNota: NotaEnfermeria | undefined = undefined;

    for (let i = 0; i < textoCompleto.length; i += this.MAX_SEGMENT_LENGTH) {
        const segmento = textoCompleto.substring(i, i + this.MAX_SEGMENT_LENGTH);

       const nota = this.notaEnfermeriaRepository.create({
          expediente,
          titulo: titulo || 'Sin título',
          segmento,
          notaPadre: notaPadre, 
      });

        await this.notaEnfermeriaRepository.save(nota);

        if (!notaPadre) {
            notaPadre = nota;
            primeraNota = nota;
        }
    }

    if (!primeraNota) {
        throw new BadRequestException('No se pudo crear la nota de enfermería');
    }

    return primeraNota;
}


  async obtenerNotaCompleta(idNotaPadre: number): Promise<{ id: number; titulo: string; nota: string; fecha: string }> {
      const notas = await this.notaEnfermeriaRepository.find({
          where: [{ id: idNotaPadre }, { notaPadre: { id: idNotaPadre } }],
          order: { id: 'ASC' },
      });

      if (!notas || notas.length === 0) {
          throw new NotFoundException('Nota no encontrada');
      }

      const notaPadre = notas[0];
      const notaCompleta = notas.map(n => n.segmento).join('');

      return {
          id: idNotaPadre,
          titulo: notaPadre.titulo,
          nota: notaCompleta,
          fecha: formatFecha(notaPadre.fecha), 
      };
  }

  async obtenerNotasPorExpediente(expedienteId: number): Promise<{ id: number; titulo: string; nota: string; fecha: string }[]> {
      const notasPadre = await this.notaEnfermeriaRepository.find({
          where: {
              expediente: { id_expediente: expedienteId },
              notaPadre: IsNull(),
          },
          order: { fecha: 'ASC' },
      });

      const resultado: { id: number; titulo: string; nota: string; fecha: string }[] = [];

      for (const notaPadre of notasPadre) {
          const notaCompleta = await this.obtenerNotaCompleta(notaPadre.id);
          resultado.push(notaCompleta);
      }

      return resultado;
  }

  async getExpedienteEnfermeria(idExpediente: number) {

    const expedienteEnfermeria = await this.expedienteResidenteRepository.findOne({
        where: { id_expediente: idExpediente },
        relations: ['residente', 'patologias', 'administraciones', 'administraciones.medicamento', 'administraciones.unidad'],
    });

    if(!expedienteEnfermeria){
      throw new NotFoundException('Expediente no encontrado');
    }

    const dtos = plainToInstance(ExpedienteEnfermeriaDto, expedienteEnfermeria, { excludeExtraneousValues: true });

    return dtos;
  }

  async createCuracion(createCuracionDto: CreateCuracionDto, id: number): Promise<Curaciones> {

    const expediente = await this.expedienteResidenteRepository.findOne({
      where: { id_expediente: id }
    })

    if(!expediente){
      throw new NotFoundException('Expediente no encontrado');
    }

    const curacion = this.curacionesRepository.create({
      ...createCuracionDto,
      expediente
    });

    return this.curacionesRepository.save(curacion);
  }

  async createConsultaEbais(createConsulta: createConsultaEbaisDto, id: number): Promise<Consulta_Ebais> {

    const expediente = await this.expedienteResidenteRepository.findOne({
      where: { id_expediente: id }
    })

    if(!expediente){
      throw new NotFoundException('Expediente no encontrado');
    }

    const consulta = this.consultaEbaisRepository.create({
      ...createConsulta,
      expediente
    });

    return this.consultaEbaisRepository.save(consulta);
  }

  async createTipoConsulta(createTipoConsulta: createTipoConsultaDto): Promise<{message: string}> {
    const nuevoTipoConsulta = this.tipoConsultaRepository.create(createTipoConsulta);
    await this.tipoConsultaRepository.save(nuevoTipoConsulta);
    return { message: 'Tipo de consulta creado' };
  }

  async asociarTipoConusltaAConsulta(id_tipo_consulta: number, id_expediente: number, createConsulta: CreateConsultaEspecialista){
    
    const expediente = await this.expedienteResidenteRepository.findOne({
      where: {id_expediente: id_expediente}
    })

    if(!expediente){
      throw new NotFoundException('Expediente no encontrado');
    }

    const tipoConsulta = await this.tipoConsultaRepository.findOne({
      where: { id_tipo_consulta: id_tipo_consulta }
    })

    if(!tipoConsulta){
      throw new NotFoundException('Tipo de consulta no encontrado');
    }

    const consultaEspecialista = this.consultaEspecialistaRepository.create({
      ...createConsulta,
      expediente,
      tipoConsulta
    });

    return this.consultaEspecialistaRepository.save(consultaEspecialista);
  }

  getBitacoras() {
    return BitacorasOpts.map(opt => ({
      id: opt.id,
      nombre: opt.nombre, 
    }));
  }

  async getTipoConsultas(){
    return this.tipoConsultaRepository.find();
  }
  
  async getConsultasEspecialistas(idTipoConsulta: number, idExpediente: number) {
    const consultas = await this.consultaEspecialistaRepository.find({
      where: {
        expediente: { id_expediente: idExpediente },
        tipoConsulta: { id_tipo_consulta: idTipoConsulta },
      },
      relations: ['tipoConsulta'],
    });

    const Tipo_Consulta = await this.tipoConsultaRepository.findOne({
      where: { id_tipo_consulta: idTipoConsulta }
    });

    if(!Tipo_Consulta){
      throw new NotFoundException('Tipo de consulta no encontrada');
    }

    return plainToInstance(MostrarConsultaEspecialistaDto, consultas, { excludeExtraneousValues: true });
  }

  async getCuraciones(idExpediente: number) {
    const curaciones = await this.curacionesRepository.find({
      where: { expediente: { id_expediente: idExpediente } },
    });

    return plainToInstance(MostrarCuracionDto, curaciones, { excludeExtraneousValues: true });
  }

  async getConsultaEbais(idExpediente: number) {
    const consultas = await this.consultaEbaisRepository.find({
      where: { expediente: { id_expediente: idExpediente } },
    });

    return plainToInstance(MostrarConsultaEbais, consultas, { excludeExtraneousValues: true });
  }

  async createUnidadMedida(createUnidadMedidaDto: CreateUnidadMedidaDto){
    const unidadMedida = this.unidadMedidaRepository.create(createUnidadMedidaDto);
    return this.unidadMedidaRepository.save(unidadMedida);
  }

  async getUnidadesMedida(){
    return this.unidadMedidaRepository.find();
  }

  async agregarMedicamentoExpediente(idExpediente: number, agregarRegistro: CreateAdministracionDto){
    const expediente = await this.expedienteResidenteRepository.findOne({
      where: { id_expediente: idExpediente }
    })

    if(!expediente){
      throw new NotFoundException('Expediente no encontrado');
    }

    const medicamento = await this.medicamentoRepository.findOne({
      where: { id_medicamento: agregarRegistro.id_medicamento }
    })

    if(!medicamento){
      throw new NotFoundException('Medicamento no encontrado');
    }

    const unidad = await this.unidadMedidaRepository.findOne({
      where: { id_unidad: agregarRegistro.id_unidadMedida }
    });

    if(!unidad){
      throw new NotFoundException('Unidad de medida no encontrada');
    }

    const administracion = this.administracionRepository.create({
      turno: agregarRegistro.turno,
      cantidad: agregarRegistro.cantidad,
      unidad,
      expediente,
      medicamento: medicamento,
    });

    return this.administracionRepository.save(administracion);

  }

}


