import { Module } from '@nestjs/common';
import { ResidentesService } from './residentes.service';
import { ResidentesController } from './residentes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Residente } from './entities/residente.entity';
import { Expediente_Residente } from './entities/expedientes.entity';
import { Encargado } from './entities/encargado.entity';
import { Patologias } from './entities/patologias.entity';
import { Administraciones } from './entities/administraciones.entity';
import { Medicamentos } from './entities/medicamento.entity';
import { AdministracionesEspeciales } from './entities/administracionEspecial.entity';
import { NotaEnfermeria } from './entities/NotaEnfermeria.entity';
import { Curaciones } from './entities/curaciones.entity';
import { Consulta_Ebais } from './entities/consultaEbais.entity';
import { Consulta_Especialista } from './entities/consultaEspecialista.entity';
import { Tipo_Consulta } from './entities/tipoConsulta.entity';
import { Unidad_Medida } from '../unidades-medida/entities/unidadMedida.entity';
import { AdministracionMedicamento } from './entities/administracioneMedicamento';
import { Libro_Campo } from './entities/libroCampo.entity';
import { GestionUsuarioModule } from '../gestion-usuario/gestion-usuario.module';



@Module({
  imports: [
    TypeOrmModule.forFeature([
      Residente, 
      Expediente_Residente, 
      Encargado, 
      Patologias, 
      Administraciones, 
      Medicamentos, 
      AdministracionesEspeciales, 
      NotaEnfermeria,
      Curaciones,
      Consulta_Ebais,
      Consulta_Especialista,
      Tipo_Consulta,
      Unidad_Medida,
      AdministracionMedicamento,
      Libro_Campo,
    ]),
    GestionUsuarioModule, 
  ],
  providers: [ResidentesService],
  controllers: [ResidentesController],
})
export class ResidentesModule {}
