import { Module } from '@nestjs/common';
import { GestionUsuarioService } from './services/gestion-usuario.service';
import { GestionUsuarioController } from './gestion-usuario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Permiso } from './entities/permiso.entity';
import { RolUsuario } from './entities/rol.entity';
import { PermisosService } from './services/permiso-roles.service';
import { Accion } from './entities/accion.entity';
import { RolPermisoAccion } from './entities/rolPermisoAccion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, RolUsuario, Permiso, Accion, RolPermisoAccion])],
  providers: [GestionUsuarioService, PermisosService],
  controllers: [GestionUsuarioController],
  exports: [GestionUsuarioService]
})
export class GestionUsuarioModule {}
