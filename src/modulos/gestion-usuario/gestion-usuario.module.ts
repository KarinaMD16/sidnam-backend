import { Module } from '@nestjs/common';
import { GestionUsuarioService } from './gestion-usuario.service';
import { GestionUsuarioController } from './gestion-usuario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  providers: [GestionUsuarioService],
  controllers: [GestionUsuarioController],
  exports: [GestionUsuarioService]
})
export class GestionUsuarioModule {}
