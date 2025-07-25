import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateReporteVoluntarioDto } from "./dto/create-reporte-voluntario.dto";
import { Not, Repository } from "typeorm";
import { ReporteVoluntario } from "./entities/reporte-voluntario.entity";
import { ResponseReporteVoluntarioDto } from "./dto/response-reporte-voluntario.dto";
import { tipoVoluntario } from "../tipo-voluntario/entities/tipo-voluntario.entity";

@Injectable()
export class ReporteVoluntarioService {
  constructor(
    @InjectRepository(ReporteVoluntario)
    private readonly reporteVoluntarioRepo: Repository<ReporteVoluntario>,

    @InjectRepository(tipoVoluntario)
    private readonly tipoVoluntarioRepo: Repository<tipoVoluntario>

  ) {}

  async create(data: CreateReporteVoluntarioDto): Promise<ResponseReporteVoluntarioDto> {

     const exists = await this.reporteVoluntarioRepo.findOneBy({
        cedula: data.cedula,
       })
     if (exists) {
        throw new ConflictException(`Voluntario con la cedula: ${data.cedula} ya existe`);
       }

     const tipoVoluntario = await this.tipoVoluntarioRepo.findOneBy({idTipoVoluntario: data.idTipoVoluntario});
        
        if (!tipoVoluntario) {
          throw new BadRequestException('Tipo de voluntario no encontrado.');
        }
   
    
    const createReporte = this.reporteVoluntarioRepo.create({
  ...data,
  tipoVoluntario: tipoVoluntario
});
    const voluntario = await this.reporteVoluntarioRepo.save(createReporte);
    return {
        nombre: voluntario.nombre,
        apellido: voluntario.apellido,
        segundoApellido: voluntario.segundoApellido,
        cedula: voluntario.cedula,
        sexo: voluntario.sexo,
        ocupacion: voluntario.ocupacion,
        telefono: voluntario.telefono,
        correo: voluntario.correo,
        direccion: voluntario.direccion,
        descripcion: voluntario.descripcion,
        dia: voluntario.dia,
        horaInicio: voluntario.horaInicio,
        horaFin: voluntario.horaFin,
        estadoVoluntario: voluntario.estadoVoluntario,
        contactoEmergencia: voluntario.contactoEmergencia,
        experiencia: voluntario.experiencia,
        observaciones: voluntario.observaciones,
        tipoVoluntario: {
          idTipoVoluntario: voluntario.tipoVoluntario.idTipoVoluntario,
          tipoVoluntario: voluntario.tipoVoluntario.tipoVoluntario
        }
    }
  }

  async findAll(): Promise<ResponseReporteVoluntarioDto[]> {
  const reportes = await this.reporteVoluntarioRepo.find({
    relations: ['tipoVoluntario'],
  });

  return reportes.map((voluntario) => ({
    nombre: voluntario.nombre,
    apellido: voluntario.apellido,
    segundoApellido: voluntario.segundoApellido,
    cedula: voluntario.cedula,
    sexo: voluntario.sexo,
    ocupacion: voluntario.ocupacion,
    telefono: voluntario.telefono,
    correo: voluntario.correo,
    direccion: voluntario.direccion,
    descripcion: voluntario.descripcion,
    dia: voluntario.dia,
    horaInicio: voluntario.horaInicio,
    horaFin: voluntario.horaFin,
    contactoEmergencia: voluntario.contactoEmergencia,
    estadoVoluntario: voluntario.estadoVoluntario,
    experiencia: voluntario.experiencia,
    observaciones: voluntario.observaciones,
    tipoVoluntario: {
      idTipoVoluntario: voluntario.tipoVoluntario?.idTipoVoluntario,
      tipoVoluntario: voluntario.tipoVoluntario?.tipoVoluntario
    }
  }));
 }


 async update(id: number, data: CreateReporteVoluntarioDto) {
  const voluntario = await this.reporteVoluntarioRepo.findOne({
    where: { idVoluntario: id },
    relations: ['tipoVoluntario'],
  });

  if (!voluntario) {
    throw new NotFoundException(`No se encontró el voluntario con el ID ${id}`);
  }

  const cedulaExistente = await this.reporteVoluntarioRepo.findOne({
    where: {
      cedula: data.cedula,
      idVoluntario: Not(id),
    },
  });

  if (cedulaExistente) {
    throw new ConflictException(`Ya existe otro voluntario con la cédula: ${data.cedula}`);
  }

  const tipoVoluntario = await this.tipoVoluntarioRepo.findOneBy({ idTipoVoluntario: data.idTipoVoluntario });
  if (!tipoVoluntario) {
    throw new BadRequestException('Tipo de voluntario no encontrado.');
  }

  Object.assign(voluntario, {
    ...data,
    tipoVoluntario: tipoVoluntario,
  });

  await this.reporteVoluntarioRepo.save(voluntario);

  }

}

