import { Entity, Column, PrimaryGeneratedColumn, OneToMany, DeleteDateColumn } from "typeorm";
import { Usuario } from "./usuario.entity";
import { RolPermisoAccion } from "./rolPermisoAccion.entity";


@Entity()
export class RolUsuario {
  @PrimaryGeneratedColumn()
  id_rol: number;

  @Column({ length: 500 })
  nombre: string;

  @Column({ length: 500 })
  descripcion: string;

  @Column({ default: true })
  estado: boolean;

  @OneToMany(() => Usuario, usuario => usuario.rol)
  usuarios: Usuario[];

  @OneToMany(() => RolPermisoAccion, rpa => rpa.rol)
  rolPermisoAcciones: RolPermisoAccion[];

  @DeleteDateColumn()
  deletedAt: Date;
}
