import { Expose, Transform, Type } from "class-transformer";
import { EstadoUsuarioOpts } from "src/common/enums/esatadoUsuario.enum";

export class AccionDto {
  @Expose()
  id_accion: number;

  @Expose()
  accion: string;

  @Expose()
  activo: boolean;
}

export class PermisoConAccionesDto {
  @Expose()
  id_permiso: number;

  @Expose()
  modulo: string;

  @Expose()
  seccion: string;

  @Expose()
  @Type(() => AccionDto)
  acciones: AccionDto[];
}

export class RolUsuarioDto {
  @Expose()
  id_rol: number;

  @Expose()
  nombre: string;

  @Expose()
  descripcion: string;

  @Expose()
  @Type(() => PermisoConAccionesDto)
  permisos: PermisoConAccionesDto[];
}

export class GetUsuarioPermisosDto {
  @Expose()
  id: number;

  @Expose()
  cedula: string;

  @Expose()
  name: string;

  @Expose()
  apellido1: string;

  @Expose()
  apellido2: string;

  @Expose()
  email: string;

  @Expose()
  @Transform(({ obj }) => {
    const opt = EstadoUsuarioOpts.find(o => o.value === obj.estado);
    return opt ? opt.nombre : null;
  })
  estado: string;

  @Expose()
  @Transform(({ value }) => {
    if (!value) return null;
    const date = value instanceof Date ? value : new Date(value);
    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const y = date.getFullYear().toString().slice(-2);
    return `${d}-${m}-${y}`;
  })
  createdAt: string;

  @Expose()
  @Type(() => RolUsuarioDto)
  rol: RolUsuarioDto;
}
