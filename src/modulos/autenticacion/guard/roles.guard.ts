import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { InjectRepository } from "@nestjs/typeorm";
import { RolUsuario } from "src/modulos/gestion-usuario/entities/rol.entity";
import { Repository } from "typeorm";
 // servicio que accede a la DB

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(RolUsuario)
    private readonly rolesService: Repository<RolUsuario>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si la ruta no requiere roles explícitos, basta con estar autenticado
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    // 1. Verificar que el rol del usuario existe en la DB
    const roleExists = await this.rolesService.findOne({ where: { nombre: user.role } });
    if (!roleExists) {
      throw new ForbiddenException("El rol del usuario no existe o fue revocado");
    }

    // 2. Verificar que el rol del usuario está entre los requeridos
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException("No tienes permisos para acceder a esta ruta");
    }

    return true;
  }
}
