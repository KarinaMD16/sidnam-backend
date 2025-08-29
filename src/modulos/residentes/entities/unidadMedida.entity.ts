import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Administraciones } from './administraciones.entity';

@Entity()
export class Unidad_Medida {
  @PrimaryGeneratedColumn()
  id_unidad: number;

  @Column()
  nombre: string;

  @Column()
  abreviatura: string;

  @OneToMany(() => Administraciones, administracion => administracion.unidad)
  administraciones: Administraciones[];

}