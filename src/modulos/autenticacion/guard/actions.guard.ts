import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import { RolUsuario } from "src/modulos/gestion-usuario/entities/rol.entity";
import { RolPermisoAccion } from "src/modulos/gestion-usuario/entities/rolPermisoAccion.entity";
import { Repository } from "typeorm";
import { ACCION_KEY } from "../decorators/roles.decorator";


@Injectable()
export class RolesAccionesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(RolPermisoAccion)
    private readonly rolPermisoAccionRepo: Repository<RolPermisoAccion>,
    @InjectRepository(RolUsuario)
    private readonly rolRepo: Repository<RolUsuario>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const accionRequerida = this.reflector.getAllAndOverride<string>(ACCION_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!accionRequerida) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    const rol = await this.rolRepo.findOne({ where: { id_rol: user.rol_id } });
    if (!rol) {
      throw new ForbiddenException("El rol del usuario no existe o fue revocado");
    }


    const permiso = await this.rolPermisoAccionRepo.findOne({
      where: {
        rol: { id_rol: rol.id_rol },
        accion: { accion: accionRequerida },
      },
      relations: ["accion", "rol"],
    });

    if (!permiso) {
      throw new ForbiddenException("No tienes permisos para realizar esta acción");
    }

    return true;
  }
}
