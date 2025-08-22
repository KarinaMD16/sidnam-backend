import { Entity, PrimaryGeneratedColumn, Column, ManyToMany} from 'typeorm';
import { Residente } from './residente.entity';

@Entity()
export class Encargado{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nombre: string;

  @Column({ nullable: false })
  cedula: string;

  @Column({ nullable: false })
  apellido1: string;

  @Column({ nullable: true })
  apellido2: string;

  @Column()
  telefono: string;

  @Column()
  correo: string;

  @ManyToMany(() => Residente, residente => residente.encargados)
  residentes: Residente[];
}