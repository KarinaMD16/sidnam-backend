import { Module } from '@nestjs/common';
import { VoluntariadoService } from './services/voluntariado.service';
import { VoluntariadoController } from './controllers/voluntariado.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contacto_emergencia } from './entities/contactoEmergencia.entity';
import { Horario } from './entities/horario.entity';
import { SolicitudAprobada } from './entities/solicitudAprobada.entity';
import { SolicitudPendiente } from './entities/solicitudPendiente.entity';
import { Tipo_voluntariado } from './entities/tipoVoluntariado.entity';
import { Voluntario } from './entities/voluntariado.entity';
import { ContactoEmergenciaPendiente } from './entities/contactoEmergenciaPendiente';
import { HorarioPendiente } from './entities/horarioPendiente.entity';
import { VoluntariadoGateway } from './voluntariado.gateway';
import { AutenticacionModule } from '../autenticacion/autenticacion.module';
import { GestionUsuarioModule } from '../gestion-usuario/gestion-usuario.module';
import { Actividades } from './entities/actividades.entity';
import { CreateExpedienteUseCase } from './use-cases/expediente/create-expediente.use-case';
import { UpdateExpedienteUseCase } from './use-cases/expediente/update-expediente.use-case';
import { CreateSolicitudUseCase } from './use-cases/solicitud/create-solicitud.use-case';
import { GetExpedientesUseCase } from './use-cases/expediente/get-expedientes.use-case';
import { GetSolicitudesUseCase } from './use-cases/solicitud/get-solicitud.use-case';
import { PdfHtmlService } from 'src/common/services/pdf-html.service';
import { ReporteService } from './services/reporte.service';



@Module({
  imports: [
    TypeOrmModule.forFeature([Contacto_emergencia, ContactoEmergenciaPendiente, Horario, HorarioPendiente, SolicitudAprobada, SolicitudPendiente, Tipo_voluntariado, Voluntario, Actividades]),
  AutenticacionModule,
  GestionUsuarioModule],
  providers: [VoluntariadoService, VoluntariadoGateway, UpdateExpedienteUseCase, CreateExpedienteUseCase, CreateSolicitudUseCase, GetExpedientesUseCase, GetSolicitudesUseCase, PdfHtmlService, ReporteService],
  controllers: [VoluntariadoController]
})
export class VoluntariadoModule {}
