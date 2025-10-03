import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { RolPermisoAccion } from 'src/modulos/gestion-usuario/entities/rolPermisoAccion.entity';
import { Repository } from 'typeorm';
import { SECCION_KEY } from '../decorators/seccionRequerida.decorator';
import { ACCION_KEY } from '../decorators/roles.decorator';

@Injectable()
export class SeccionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(RolPermisoAccion)
    private readonly rolPermisoAccionRepo: Repository<RolPermisoAccion>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const seccionRequerida = this.reflector.getAllAndOverride<string>(SECCION_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const accionRequerida = this.reflector.getAllAndOverride<string>(ACCION_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!seccionRequerida) return true;

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.roleid) {
      throw new ForbiddenException('No autenticado o sin rol');
    }

    // Buscamos un permiso que cumpla con rol + sección + acción
    const permisoValido = await this.rolPermisoAccionRepo.findOne({
      where: {
        rol: { id_rol: user.roleid },
        permiso: { seccion: seccionRequerida },
        ...(accionRequerida ? { accion: { accion: accionRequerida } } : {}),
      },
      relations: ['permiso', 'rol', 'accion'],
    });

    if (!permisoValido) {
      throw new ForbiddenException(
        `No tienes acceso a la sección "${seccionRequerida}"` +
        (accionRequerida ? ` con la acción "${accionRequerida}"` : ''),
      );
    }

    return true;
  }
}
