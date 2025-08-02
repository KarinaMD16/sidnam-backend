import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Solicitud_pendiente } from "./entities/solicitudPendiente.entity";
import { DataSource, Repository } from "typeorm";
import { Tipo_donacion } from "./entities/tipoDonacion.entity";
import { SolicitudDonacionGateway } from "./solicitudDonacion.gateway";
import { EmailService } from "../autenticacion/email/email.service";
import { GestionUsuarioService } from "../gestion-usuario/gestion-usuario.service";
import { CrearSolicitudPendienteDto } from "./dto/crearSolicitudPendienteDto";
import { CrearSolicitudAprobadaDto } from "./dto/crearSolicitudAprobadaDto";
import { RegistroDonacion } from "./entities/registroDonacion.entity";
import { TipoDonacionDto } from "./dto/crearTipoDonacionDto";
import { plainToInstance } from "class-transformer";
import { SolicitudPreviewDto } from "./dto/solicitudPreviewDto";
import { VerSolicitudPendienteDto } from "./dto/verSolicitudPendienteDto";
import { EstadoSolicitud } from "src/common/enums/estadosSolicitudes.enum";
import { EstadoMap } from "src/common/constants/estado.constant";
import { Usuario } from "../gestion-usuario/entities/usuario.entity";


@Injectable()
export class  SolicitudDonacionService {

    constructor(

         @InjectRepository(Solicitud_pendiente)
         private readonly solicitudPendiente: Repository<Solicitud_pendiente>,

         @InjectRepository(Tipo_donacion)
         private readonly tipoDonacion: Repository<Tipo_donacion>,

         private readonly solicitudDonacionGateway: SolicitudDonacionGateway,

         private readonly dataSource: DataSource,

         private readonly emailService: EmailService,

         private readonly gestionUsuario: GestionUsuarioService

    ){}



    async crearSolicitudPendiente(solicitud: CrearSolicitudPendienteDto): Promise<Solicitud_pendiente> {

        const donacion = await this.tipoDonacion.findOne({
            where: {id: solicitud.tipoDonacion},
        });

        if(!donacion){
             throw new NotFoundException(`Tipo de donacion con id ${solicitud.tipoDonacion} no encontrado`);
         }

         const crearSolicitud = this.solicitudPendiente.create({
                nombre: solicitud.nombre,
                apellido1: solicitud.apellido1,
                apellido2: solicitud.apellido2,
                telefono: solicitud.telefono,
                email: solicitud.email,
                anonimo: solicitud.anonimo,
                descripcion: solicitud.descripcion,
                tipoDonacion: solicitud.tipoDonacion,
                observaciones: solicitud.observaciones,

         })

         const solicitudPendiente = await this.solicitudPendiente.save(crearSolicitud);

         const total = await this.solicitudPendiente.count({where: {estado: 'pendiente'}})
         this.solicitudDonacionGateway.emitSolicitudesPendientesCount(total)

         return solicitudPendiente;
    }


    async crearRegistroDonacion(solicitud: CrearSolicitudAprobadaDto, idUsuario: number): Promise<{ message: string }> {

        const usuario = await this.gestionUsuario.findOneById(idUsuario);

        await this.dataSource.transaction(async manager => {
          const tipoDonacion = await manager.findOne(Tipo_donacion, {
          where: { id: solicitud.tipoDonacion },
          });

         if (!tipoDonacion) {
          throw new NotFoundException(`Tipo de donación con id ${solicitud.tipoDonacion} no encontrado`);
         }

         const solicitudAprobada = manager.create(RegistroDonacion, {
          tipoDonacion,
          datosExtra: `Aprobado por: ${usuario.name}`,
          observaciones: solicitud.observaciones,
         });

           await manager.save(solicitudAprobada);
         });

          return { message: 'Solicitud de donación aprobada correctamente' };
     }



     async crearTipoDonacion(tipoDto: TipoDonacionDto): Promise<Tipo_donacion> {
       const existente = await this.tipoDonacion.findOne({
       where: { nombre: tipoDto.nombre },
       });

        if (existente) {
         throw new ConflictException(`El tipo de donación "${tipoDto.nombre}" ya existe`);
        }

        const nuevoTipoDonacion = this.tipoDonacion.create(tipoDto);
        return await this.tipoDonacion.save(nuevoTipoDonacion);
     }



     async getAllTipoDonacion(): Promise<TipoDonacionDto[]>{
        return await this.tipoDonacion.find()
     }


     async findAllPreviews(page?: number, limit?: number): Promise<{ data: SolicitudPreviewDto[]; total: number }> {
         const [data, total] = await this.solicitudPendiente.findAndCount({
             skip: page && limit ? (page - 1) * limit : 0,
             take: limit,
             order: { id: 'DESC' },
             select: ['id', 'nombre', 'apellido1', 'apellido2', 'creadoEn', 'estado'],
         });
     
         const dtos = plainToInstance(SolicitudPreviewDto, data, { excludeExtraneousValues: true });
     
         return { data: dtos, total };
     }


     async findSolicitudById(id: number): Promise<VerSolicitudPendienteDto> {
        const solicitud = await this.solicitudPendiente.findOne({
            where: { id },
            select: [
            'id',
            'nombre',
            'apellido1',
            'apellido2',
            'telefono',
            'email',
            'anonimo',
            'descripcion',
            'tipoDonacion',
            'estado',
            'creadoEn',
            'observaciones',
            ], 
        });
     
        if (!solicitud) {
           throw new NotFoundException(`No se encontró la solicitud con id ${id}`);
                 
        }
     
        const dto = plainToInstance(VerSolicitudPendienteDto, solicitud, {
            excludeExtraneousValues: true,
        });
     
        return dto;

      }


         getEstadosSolicitud() {
      
         const estados = Object.entries(EstadoSolicitud)
         .filter(([key, value]) => typeof value === 'number') 
         .map(([key, value]) => ({
              id: value as number,
              nombre: key,
         }));
      
         return estados;
      }



      async getFiltrosEstados(id: number, page?: number, limit?: number): Promise<{ data: SolicitudPreviewDto[]; total: number }> {

         const estadoNombre = Object.values(EstadoSolicitud).filter(v => typeof v === 'number') as number[];
      
         if (!estadoNombre.includes(id)) {
             throw new NotFoundException('Estado no existente');
         }
      
         const estado = EstadoMap[id];
      
         const [data, total] = await this.solicitudPendiente.findAndCount({
             where: { estado },
             skip: page && limit ? (page - 1) * limit : 0,
             take: limit,
             order: { id: 'DESC' },
             select: ['id', 'nombre', 'apellido1', 'apellido2', 'creadoEn', 'estado'],
         });
      
          const dtos = plainToInstance(SolicitudPreviewDto, data, {
                 excludeExtraneousValues: true,
          });
      
          return { data: dtos, total };
      }


      async updateEstadoDonacion(idEstado: number, idSolicitud: number, idUsuario: number): Promise<{ message: string }> {
         const estadosValidos = Object.values(EstadoSolicitud).filter(v => typeof v === 'number') as number[];

         if (!estadosValidos.includes(idEstado)) {
         throw new NotFoundException('Estado no existente');
         }

         const estado = EstadoMap[idEstado];

         const solicitud = await this.solicitudPendiente.findOne({
            where: { id: idSolicitud },
         });

         if (!solicitud) {
              throw new NotFoundException(`Solicitud con id ${idSolicitud} no encontrada`);
         }

         if (solicitud.estado === 'aprobada') {
              throw new BadRequestException('Esta solicitud ya ha sido aprobada');
         }

         if (solicitud.estado === 'rechazada') {
              throw new BadRequestException('Esta solicitud ya ha sido rechazada');
         }

         const usuario = await this.gestionUsuario.findOneById(idUsuario);

         solicitud.estado = estado;
         await this.solicitudPendiente.save(solicitud);

         if (estado === 'aprobada') {
           await this.crearConfirmacionDonacion(solicitud, usuario);
           return { message: 'La solicitud de donación ha sido aprobada' };
         }

         if (estado === 'rechazada') {
            await this.emailService.sendSolicitudRechazadaEmail(solicitud.email, solicitud.nombre);
            return { message: 'La solicitud de donación ha sido rechazada' };
         }

         const totalPendientes = await this.solicitudPendiente.count({ where: { estado: 'pendiente' } });
         this.solicitudDonacionGateway.emitSolicitudesPendientesCount(totalPendientes);

         return { message: 'Estado actualizado correctamente' };
    }




      async crearConfirmacionDonacion(solicitud: Solicitud_pendiente, usuario: Usuario): Promise<void> {
  
          await this.dataSource.transaction(async manager => {

          const tipoDonacion = await manager.findOne(Tipo_donacion, {
          where: { id: solicitud.tipoDonacion },
          });

          if (!tipoDonacion) {
            throw new NotFoundException(`Tipo de donación con ID ${solicitud.tipoDonacion} no encontrado`);
          }

          const solicitudAprobada = manager.create(RegistroDonacion, {
          tipoDonacion,
          observaciones: solicitud.observaciones,
          datosExtra: `Aprobada por: ${usuario.name}`,
          solicitudDonacion: solicitud,
          });

          await manager.save(solicitudAprobada);
       });

       await this.emailService.sendSolicitudAceptadaEmail(solicitud.email, solicitud.nombre);
    }

}
