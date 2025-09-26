import { Entity, Column, PrimaryGeneratedColumn, OneToMany, DeleteDateColumn } from "typeorm";
import { RolPermisoAccion } from "./rolPermisoAccion.entity";


@Entity()
export class Permiso {
  @PrimaryGeneratedColumn()
  id_permiso: number;

  @Column({ length: 100 })
  modulo: string;

  @Column({ length: 100, nullable: true })
  seccion: string;

  @OneToMany(() => RolPermisoAccion, rpa => rpa.permiso)
  rolPermisoAcciones: RolPermisoAccion[];

  @DeleteDateColumn()
  deletedAt: Date;
}
