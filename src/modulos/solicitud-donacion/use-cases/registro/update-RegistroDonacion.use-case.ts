import { InjectRepository } from "@nestjs/typeorm"
import { RegistroDonacion } from "../../entities/registroDonacion.entity"
import { Not, Repository } from "typeorm"
import { Donador } from "../../entities/donador.entity"
import { NotFoundException } from "@nestjs/common"
import { GestionUsuarioService } from "src/modulos/gestion-usuario/services/gestion-usuario.service"
import { ActualizarRegistroDto } from "../../dto/actualizarRegistroDto"

export class UpdateRegistroDonacionUseCase{

    constructor(

    @InjectRepository(RegistroDonacion)
        private readonly registroDonacion: Repository<RegistroDonacion>,
                
        @InjectRepository(Donador)
        private readonly donadorRepository: Repository<Donador>,

        private readonly gestionUsuario: GestionUsuarioService
                
      ) {}

      
          async updateEstadoARecibido(id: number, idUsuario: number): Promise<{ message: string }> {

              const usuario = await this.gestionUsuario.findOneById(idUsuario );
               if (!usuario) throw new NotFoundException('Usuario no encontrado');


              const registro = await this.registroDonacion.findOne({ where: { id } });
               if (!registro) throw new NotFoundException('Registro no encontrado');

  
               if (registro.recibida) {
                    return { message: 'El registro ya estaba marcado como recibido' };
               }

               if (!registro.recibida) {
               registro.recibida = true;
               registro.recibidaEn = new Date();
               registro.recibidaPor = `Recibido por: ${usuario.name}`;
               await this.registroDonacion.save(registro);
               }

  
                  return { message: 'Registro recibido con éxito' };
              }


              async updateRegistro(idRegistro: number, actualizarRegistro: Partial<ActualizarRegistroDto>): Promise<{message: string}> {
                    
                const registro = await this.registroDonacion.findOne({
                   where: { 
                        id: idRegistro,
                   },
                   relations: ['donador']
                });

                if (!registro) {
                    throw new NotFoundException('Registro no encontrado');
                }

                const donador = registro.donador;

                if (actualizarRegistro.cedula) {
                    const cedulaExistente = await this.donadorRepository.findOne({
                        where: {
                            cedula: actualizarRegistro.cedula,
                             id: Not(donador.id),
                        },
                    });


                    if (cedulaExistente) {
                        throw new NotFoundException('La cédula ya está registrada para otro donador');
                    }

                    donador.cedula = actualizarRegistro.cedula;

                }

                if (actualizarRegistro.nombre) donador.nombre = actualizarRegistro.nombre;
                if (actualizarRegistro.apellido1) donador.apellido1 = actualizarRegistro.apellido1;
                if (actualizarRegistro.apellido2 !== undefined) donador.apellido2 = actualizarRegistro.apellido2;
                if (actualizarRegistro.telefono) donador.telefono = actualizarRegistro.telefono;
                if (actualizarRegistro.email) donador.email = actualizarRegistro.email;
                if (actualizarRegistro.anonimo) registro.anonimo = actualizarRegistro.anonimo;
                if (actualizarRegistro.tipoDonacion) registro.tipoDonacion = actualizarRegistro.tipoDonacion;
                if (actualizarRegistro.descripcion !== undefined) registro.descripcion = actualizarRegistro.descripcion;
                if (actualizarRegistro.observaciones !== undefined) registro.observaciones = actualizarRegistro.observaciones;


                await this.donadorRepository.save(donador);
                await this.registroDonacion.save(registro);

                return { message: 'Registro actualizado exitosamente' };
                
         }

}