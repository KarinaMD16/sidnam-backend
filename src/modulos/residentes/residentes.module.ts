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
import { Tipo_medicamento } from './entities/tipo_medicamento.entity';
import { AdministracionesEspeciales } from './entities/administracionEspecial.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Residente, Expediente_Residente, Encargado, Patologias, Administraciones, Medicamentos, Tipo_medicamento, AdministracionesEspeciales])],
  providers: [ResidentesService],
  controllers: [ResidentesController]
})
export class ResidentesModule {}
