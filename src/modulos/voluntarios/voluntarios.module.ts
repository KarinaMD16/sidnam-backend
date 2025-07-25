import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Voluntarios } from './entities/voluntarios.entity';
import { VoluntariosService } from './voluntarios.service';
import { VoluntariosController } from './voluntarios.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Voluntarios])],
  providers: [VoluntariosService],
  controllers: [VoluntariosController],
})
export class VoluntariosModule {}