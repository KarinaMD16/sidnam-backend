import { InjectRepository } from "@nestjs/typeorm"
import { RegistroDonacion } from "../../entities/registroDonacion.entity"
import { Repository } from "typeorm"
import { Donador } from "../../entities/donador.entity"
import { NotFoundException } from "@nestjs/common"
import { GestionUsuarioService } from "src/modulos/gestion-usuario/gestion-usuario.service"

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
}