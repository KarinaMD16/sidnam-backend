import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Expediente_Residente } from './expedientes.entity';


@Entity()
export class Patologias {
  @PrimaryGeneratedColumn()
  id_patologia: number;

  @Column()
  nombre: string

  @ManyToMany(() => Expediente_Residente, expediente => expediente.patologias)
  expedientes: Expediente_Residente[];
}