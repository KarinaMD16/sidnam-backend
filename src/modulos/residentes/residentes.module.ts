import { Module } from '@nestjs/common';
import { ResidentesService } from './residentes.service';
import { ResidentesController } from './residentes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Residente } from './entities/residente.entity';
import { Expediente_Residente } from './entities/expedientes.entity';
import { Encargado } from './entities/encargado.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Residente, Expediente_Residente, Encargado])],
  providers: [ResidentesService],
  controllers: [ResidentesController]
})
export class ResidentesModule {}
