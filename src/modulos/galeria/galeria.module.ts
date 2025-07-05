import { Module } from '@nestjs/common';
import { GaleriaService } from './galeria.service';
import { GaleriaController } from './galeria.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categoria } from './entities/categoria.entity';
import { Galeria } from './entities/galeria.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Galeria, Categoria])],
  providers: [GaleriaService],
  controllers: [GaleriaController]
})
export class GaleriaModule {}
