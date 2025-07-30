import { Module } from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service';
import { PublicacionesController } from './publicaciones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicacionDonacion } from './entities/publicacionDonacion';
import { Eventos } from './entities/eventos.entity';
import { Proyectos } from './entities/proyectos.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PublicacionDonacion, Eventos, Proyectos])],
  providers: [PublicacionesService],
  controllers: [PublicacionesController]
})
export class PublicacionesModule {}
