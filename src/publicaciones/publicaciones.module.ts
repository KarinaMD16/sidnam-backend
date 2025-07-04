import { Module } from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service';
import { PublicacionesController } from './publicaciones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Donacion } from './entities/donacion.entity';
import { Eventos } from './entities/eventos.entity';
import { Proyectos } from './entities/proyectos.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Donacion, Eventos, Proyectos])],
  providers: [PublicacionesService],
  controllers: [PublicacionesController]
})
export class PublicacionesModule {}
