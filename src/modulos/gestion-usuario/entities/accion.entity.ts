import { Entity, Column, PrimaryGeneratedColumn, OneToMany, DeleteDateColumn } from "typeorm";
import { RolPermisoAccion } from "./rolPermisoAccion.entity";


@Entity()
export class Accion {
  @PrimaryGeneratedColumn()
  id_accion: number;

  @Column()
  accion: string;

  @OneToMany(() => RolPermisoAccion, rpa => rpa.accion)
  rolPermisoAcciones: RolPermisoAccion[];

  @DeleteDateColumn()
  deletedAt: Date;
}
