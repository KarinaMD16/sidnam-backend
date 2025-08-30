import { Module } from '@nestjs/common';
import { UnidadesMedidaController } from './unidades-medida.controller';
import { UnidadesMedidaService } from './unidades-medida.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Unidad_Medida } from '../residentes/entities/unidadMedida.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Unidad_Medida])],
  controllers: [UnidadesMedidaController],
  providers: [UnidadesMedidaService]
})
export class UnidadesMedidaModule {}
