import { Module } from '@nestjs/common';
import { VoluntariadoService } from './voluntariado.service';
import { VoluntariadoController } from './voluntariado.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contacto_emergencia } from './entities/contactoEmergencia.entity';
import { Horario } from './entities/horario.entity';
import { SolicitudAprobada } from './entities/solicitudAprobada.entity';
import { SolicitudPendiente } from './entities/solicitudPendiente.entity';
import { Tipo_voluntariado } from './entities/tipoVoluntariado.entity';
import { Voluntario } from './entities/voluntariado.entity';
import { ContactoEmergenciaPendiente } from './entities/contactoEmergenciaPendiente';
import { HorarioPendiente } from './entities/horarioPendiente.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Contacto_emergencia, ContactoEmergenciaPendiente, Horario, HorarioPendiente, SolicitudAprobada, SolicitudPendiente, Tipo_voluntariado, Voluntario])],
  providers: [VoluntariadoService],
  controllers: [VoluntariadoController]
})
export class VoluntariadoModule {}
