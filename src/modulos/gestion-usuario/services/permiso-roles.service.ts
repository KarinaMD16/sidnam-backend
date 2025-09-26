import { Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Permiso } from "../entities/permiso.entity";
import { Accion } from "../entities/accion.entity";
import { RolUsuario } from "../entities/rol.entity";
import { Acciones, ModulosOpts, PermisosOpts } from "src/common/enums/rol.enum";
import { plainToInstance } from "class-transformer";
import { GetPermisosDto } from "../dto/getPermisosDto";
import { RolPermisoAccion } from "../entities/rolPermisoAccion.entity";
import { GetRolesPermisosAccionesDto } from "../dto/getRolesPermisosAccionesDto";

@Injectable()
export class PermisosService implements OnModuleInit {
  constructor(
    @InjectRepository(Permiso)
    private readonly permisoRepository: Repository<Permiso>,

    @InjectRepository(Accion)
    private readonly accionRepository: Repository<Accion>,

    @InjectRepository(RolUsuario)
    private readonly rolRepository: Repository<RolUsuario>,

    @InjectRepository(RolPermisoAccion)
    private readonly rpaRepository: Repository<RolPermisoAccion>,
  ) {}

  async onModuleInit() {

    for (const opt of PermisosOpts) {
      const existeAccion = await this.accionRepository.findOne({
        where: { accion: opt.accion },
      });

      if (!existeAccion) {
        const nuevaAccion = this.accionRepository.create({ accion: opt.accion });
        await this.accionRepository.save(nuevaAccion);
      }
    }

    for (const opt of ModulosOpts) {
      const existePermiso = await this.permisoRepository.findOne({
        where: { modulo: opt.modulo, seccion: opt.seccion },
      });

      if (!existePermiso) {
        const nuevoPermiso = this.permisoRepository.create({
          modulo: opt.modulo,
          seccion: opt.seccion,
        });
        await this.permisoRepository.save(nuevoPermiso);
      }
    }
  }


  async getAcciones() {
    return PermisosOpts.map(opt => ({ id: opt.id, accion: opt.accion }));
  }

  async getPermisos() {
    const permisos = await this.permisoRepository.find();
    return plainToInstance(GetPermisosDto, permisos, {
      excludeExtraneousValues: true,
    });
  }


  async asociarPermisoAccionARol(
    rolId: number,
    permisoId: number,
    accionId: number,
  ): Promise<{ message: string }> {
    const rol = await this.rolRepository.findOne({
      where: { id_rol: rolId },
    });
    if (!rol) {
      throw new NotFoundException("Rol no encontrado");
    }

    const permiso = await this.permisoRepository.findOneBy({
      id_permiso: permisoId,
    });
    if (!permiso) {
      throw new NotFoundException("Permiso no encontrado");
    }

    const accion = await this.accionRepository.findOneBy({
      id_accion: accionId,
    });
    if (!accion) {
      throw new NotFoundException("Acción no encontrada");
    }

    const existe = await this.rpaRepository.findOne({
      where: { rol: { id_rol: rolId }, permiso: { id_permiso: permisoId }, accion: { id_accion: accionId } },
      relations: ["rol", "permiso", "accion"],
    });

    if (existe) {
      return { message: "Ya existe la asociación para este rol/permiso/acción" };
    }

    const rpa = this.rpaRepository.create({
      rol,
      permiso,
      accion,
    });
    await this.rpaRepository.save(rpa);

    return { message: "Acción asociada al rol en el permiso correctamente" };
  }

  async desasociarPermisoAccionDeRol(rolId: number, permisoId: number, accionId: number): Promise<{ message: string }> {

    const rpa = await this.rpaRepository.findOne({
      where: { rol: { id_rol: rolId }, permiso: { id_permiso: permisoId }, accion: { id_accion: accionId } },
      relations: ["rol", "permiso", "accion"],
    });

    if (!rpa) {
      throw new NotFoundException("Asociación no encontrada");
    }

    await this.rpaRepository.remove(rpa);
    return { message: "Asociación eliminada correctamente" };
  }

  async getAccionesPorRol(rolId: number): Promise<GetRolesPermisosAccionesDto> {
    const rol = await this.rolRepository.findOne({
      where: { id_rol: rolId },
      relations: [
        "rolPermisoAcciones",
        "rolPermisoAcciones.permiso",
        "rolPermisoAcciones.accion",
      ],
    });

    if (!rol) {
      throw new NotFoundException("Rol no encontrado");
    }


    const todasAcciones = await this.accionRepository.find();

    const permisosMap = new Map<
      number,
      { id_permiso: number; modulo: string; seccion: string; acciones: any[]; accionesActivas: number[] }
    >();

    for (const rpa of rol.rolPermisoAcciones) {
      const permisoId = rpa.permiso.id_permiso;

      if (!permisosMap.has(permisoId)) {
        permisosMap.set(permisoId, {
          id_permiso: permisoId,
          modulo: rpa.permiso.modulo,
          seccion: rpa.permiso.seccion,
          acciones: [],
          accionesActivas: [],
        });
      }

      const permisoObj = permisosMap.get(permisoId);
      if (permisoObj) {
        permisoObj.accionesActivas.push(rpa.accion.id_accion);
      }
    }

    for (const permisoObj of permisosMap.values()) {
      permisoObj.acciones = todasAcciones.map(a => ({
        id_accion: a.id_accion,
        accion: a.accion,
        activo: permisoObj.accionesActivas.includes(a.id_accion),
      }));
    }

    const dtoObj = {
      id_rol: rol.id_rol,
      nombre: rol.nombre,
      descripcion: rol.descripcion,
      estado: rol.estado,
      permisos: Array.from(permisosMap.values()),
    };

    return plainToInstance(GetRolesPermisosAccionesDto, dtoObj, {
      excludeExtraneousValues: true,
    });
  }

  async desactivarRol(rolId: number): Promise<{message: string}>{

    const rol = await this.rolRepository.findOne({
      where: { id_rol: rolId },
    });

    if (!rol) {
      throw new NotFoundException("Rol no encontrado");
    }

    rol.estado = false;
    await this.rolRepository.save(rol);
    return {message: 'Rol desactivado correctamente'};
  }

  async activarRol(rolId: number): Promise<{message: string}>{

    const rol = await this.rolRepository.findOne({
      where: { id_rol: rolId },
    });

    if (!rol) {
      throw new NotFoundException("Rol no encontrado");
    }

    rol.estado = true;
    await this.rolRepository.save(rol);
    return {message: 'Rol activado correctamente'};
  }

  async getEstadoRol(rolId: number): Promise<{message: string}>{


    const rol = await this.rolRepository.findOne({
      where: { id_rol: rolId },
    });
    
    if (!rol) {
      throw new NotFoundException("Rol no encontrado");
    }

    return {message: rol.estado ? 'Activo' : 'Inactivo'};
  }

  


}
