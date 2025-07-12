import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { reporteDonacion } from './entities/reporte-donacion.entity';
import { CreateReporteDonacionDto } from './dto/create-reporte-donacion.dto';
import { ResponseReporteDonacionDto } from './dto/response-reporte-donacion.dto';
import { tipoDonacion } from '../tipo-donacion/entities/tipo-donacion.entity';

@Injectable()
export class ReporteDonacionService {
  constructor(
    @InjectRepository(reporteDonacion)
    private readonly reporteDonacionRepo: Repository<reporteDonacion>,

    @InjectRepository(tipoDonacion)
    private readonly tipoDonacionRepo: Repository<tipoDonacion>,

  ) {}

  async create(data: CreateReporteDonacionDto): Promise<ResponseReporteDonacionDto> {
    const tipoDonacion = await this.tipoDonacionRepo.findOneBy({idTipo: data.idTipo});
    
    if (!tipoDonacion) {
      throw new BadRequestException('Tipo de donación no encontrado.');
    }
    const createReporte = this.reporteDonacionRepo.create({
        ...data,
        tipoDonacion: tipoDonacion,
    });
    await this.reporteDonacionRepo.save(createReporte);
    return {
        nombre: createReporte.nombre,
        apellido: createReporte.apellido,
        segundoApellido: createReporte.segundoApellido,
        cedula: createReporte.cedula,
        correo: createReporte.correo,
        telefono: createReporte.telefono,
        estadoDonacion: createReporte.estadoDonacion,
        descripcion: createReporte.descripcion,
        monto: createReporte.monto,
        fechaDonacion: createReporte.fechaDonacion,
        observaciones: createReporte.observaciones,
        tipoDonacion: {
          idTipo: createReporte.tipoDonacion.idTipo,
          tipoDonacion: createReporte.tipoDonacion.tipoDonacion,
        },
    }
  }
}