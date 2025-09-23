import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { RolUsuario } from "./rol.entity";
import { Permiso } from "./permiso.entity";
import { Accion } from "./accion.entity";

@Entity()
export class RolPermisoAccion {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => RolUsuario, rol => rol.rolPermisoAcciones, { onDelete: "CASCADE" })
  @JoinColumn({ name: "rol_id" })
  rol: RolUsuario;

  @ManyToOne(() => Permiso, { onDelete: "CASCADE" })
  @JoinColumn({ name: "permiso_id" })
  permiso: Permiso;

  @ManyToOne(() => Accion, { onDelete: "CASCADE" })
  @JoinColumn({ name: "accion_id" })
  accion: Accion;
}
