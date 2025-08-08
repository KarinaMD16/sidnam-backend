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

    async updateExpediente(id: number, actualizarExpediente: Partial<ActualizarExpedienteDto>): Promise<{message: string}> {

        const expediente = await this.solicitudAprobada.findOne({
            where: { id },
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

        if(actualizarExpediente.horarios){

            for (const horario of actualizarExpediente.horarios) {

                const horarioExistente = await this.horarioRepository.findOne({
                    where: {id: horario.id}
                })

                if(horarioExistente){
                    horarioExistente.dia = horario.dia;
                    horarioExistente.horaFin = horario.horaFin;
                    horarioExistente.horaInicio = horario.horaInicio;
                    await this.horarioRepository.save(horarioExistente);
                }
                else{
                    const nuevoHorario = this.horarioRepository.create(horario);
                    await this.horarioRepository.save(nuevoHorario);
                }
            }
        }

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

        if (actualizarExpediente.observaciones) expediente.observaciones = actualizarExpediente.observaciones;

        await this.voluntarioRepository.save(voluntario);
        await this.solicitudAprobada.save(expediente);

        return { message: 'Expediente actualizado con éxito' };
    }
}
