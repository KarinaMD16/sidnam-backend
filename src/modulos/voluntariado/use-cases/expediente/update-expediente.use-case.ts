// use-cases/update-expediente.use-case.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Not, Repository } from 'typeorm';
import { EstadoExpediente } from 'src/common/enums/estadosExpedientes.enum';
import { SolicitudAprobada } from '../../entities/solicitudAprobada.entity';
import { Voluntario } from '../../entities/voluntariado.entity';
import { Contacto_emergencia } from '../../entities/contactoEmergencia.entity';
import { ActualizarExpedienteDto } from '../../dto/actulizarExpedienteDto';
import { Horario } from '../../entities/horario.entity';
import { ActualizarActividadesDto } from '../../dto/updateActidadDto';
import { Actividades } from '../../entities/actividades.entity';


@Injectable()
export class UpdateExpedienteUseCase {
  constructor(
    @InjectRepository(SolicitudAprobada)
    private readonly solicitudAprobada: Repository<SolicitudAprobada>,
            
    @InjectRepository(Voluntario)
    private readonly voluntarioRepository: Repository<Voluntario>,
            
    @InjectRepository(Contacto_emergencia)
    private readonly contactoRepository: Repository<Contacto_emergencia>,

    @InjectRepository(Horario)
    private readonly horarioRepository: Repository<Horario>,

    @InjectRepository(Actividades)
    private readonly actividadRepository: Repository<Actividades>,
  ) {}

    async updateEstadoAInactivo(idSolicitud: number): Promise<{message: string}>{
  
          const expediente = await this.solicitudAprobada.findOne({
              where: {id: idSolicitud}
          })
  
          if(!expediente){
              throw new NotFoundException('Expediente no encontrado');
          }
  
          expediente.estado = EstadoExpediente.Inactivo
  
          await this.solicitudAprobada.save(expediente);
  
          return {message: 'El expediente se ha inactivado con exito'}
    }

    async updateExpediente(idExpediente: number, actualizarExpediente: Partial<ActualizarExpedienteDto>): Promise<{message: string}> {

        const expediente = await this.solicitudAprobada.findOne({
            where: { 
                id: idExpediente,
            },
            relations: ['voluntario', 'horarios', 'voluntario.contactosEmergencia', 'actividades']
        });


        if (!expediente) {
            throw new NotFoundException('Expediente no registrado');
        }

        const voluntario = expediente.voluntario;

        if (actualizarExpediente.cedula) {
            const cedulaExistente = await this.voluntarioRepository.findOne({
                where: {
                    cedula: actualizarExpediente.cedula,
                    id: Not(voluntario.id),
                },
            });

            if (cedulaExistente) {
                throw new BadRequestException('Cédula existente en la base de datos');
            }

            voluntario.cedula = actualizarExpediente.cedula;
        }

        if(expediente.horarios)

        if (actualizarExpediente.nombre) voluntario.nombre = actualizarExpediente.nombre;
        if (actualizarExpediente.apellido1) voluntario.apellido1 = actualizarExpediente.apellido1;
        if (actualizarExpediente.apellido2 !== undefined) voluntario.apellido2 = actualizarExpediente.apellido2;
        if (actualizarExpediente.email) voluntario.email = actualizarExpediente.email;
        if (actualizarExpediente.telefono) voluntario.telefono = actualizarExpediente.telefono;
        if (actualizarExpediente.ocupacion) voluntario.ocupacion = actualizarExpediente.ocupacion;
        if (actualizarExpediente.direccion) voluntario.direccion = actualizarExpediente.direccion;
        if (actualizarExpediente.sexo) voluntario.sexo = actualizarExpediente.sexo;
        if (actualizarExpediente.experienciaLaboral) voluntario.experienciaLaboral = actualizarExpediente.experienciaLaboral;

        if (typeof actualizarExpediente.cantidadHoras !== 'undefined') {
            expediente.cantidadHoras = actualizarExpediente.cantidadHoras;
        }

        if (actualizarExpediente.contactosEmergencia) {
            await this.contactoRepository.delete({ voluntario: { id: voluntario.id } });

            const nuevosContactos = actualizarExpediente.contactosEmergencia.map(contacto =>
                this.contactoRepository.create({
                    ...contacto,
                    voluntario: voluntario,
                })
            );

            voluntario.contactosEmergencia = nuevosContactos;
        }

        if (actualizarExpediente.horarios) {
        for (const horarioDto of actualizarExpediente.horarios){ 
                if (horarioDto.id) {
                    const horarioExistente = expediente.horarios.find(h => h.id === horarioDto.id);
                    if (horarioExistente) {
                        horarioExistente.dia = horarioDto.dia;
                        horarioExistente.horaInicio = horarioDto.horaInicio;
                        horarioExistente.horaFin = horarioDto.horaFin;
                    } 
                } else {

                    const diaExistente = await this.horarioRepository.findOne({
                        where: {
                            dia: horarioDto.dia,
                            solicitud: { id: expediente.id },
                        }
                    })

                    if(diaExistente){
                        throw new BadRequestException('No se puede registrar un mismo dia registrado anteriormente')
                    }
                    const nuevoHorario = this.horarioRepository.create({
                        dia: horarioDto.dia,
                        horaInicio: horarioDto.horaInicio,
                        horaFin: horarioDto.horaFin,
                        solicitud: expediente,
                    });
                    expediente.horarios.push(nuevoHorario);
                }
            }
        }

        if (actualizarExpediente.observaciones) expediente.observaciones = actualizarExpediente.observaciones;

        await this.voluntarioRepository.save(voluntario);
        await this.solicitudAprobada.save(expediente);

        return { message: 'Expediente actualizado con éxito' };
    }


    async updateActividades(updateActividadesDto: ActualizarActividadesDto, idActividad: number): Promise<{ message: string }> {
        const actividad = await this.actividadRepository.findOne({
            where: { id: idActividad },
            relations: ['solicitud']
        });

        if (!actividad) {
            throw new NotFoundException('Actividad no encontrada');
        }

        if (!actividad) {
            throw new NotFoundException('No hay actividades registradas para esta actividad');
        }


        if (updateActividadesDto.fecha) {

            if(new Date(updateActividadesDto.fecha) < new Date(actividad.solicitud.aprobadaEn)){
                throw new BadRequestException('La fecha de la actividad tiene que ser mayor o igual a la de la fecha de aprobacion del expediente')
            }
        }


        actividad.fecha = updateActividadesDto.fecha ?? actividad.fecha;
        actividad.cantidadHoras = updateActividadesDto.cantidadHoras ?? actividad.cantidadHoras;
        actividad.actividades = updateActividadesDto.actividades ?? actividad.actividades;

        await this.actividadRepository.save(actividad);

        return { message: 'Actividad actualizada con éxito' };
        
    }
}
