import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Expediente_Residente } from './expedientes.entity';
import { Medicamentos } from './medicamento.entity';

@Entity()
export class Tipo_medicamento {
  @PrimaryGeneratedColumn()
  id_tipo_medicamento: number;

  @Column()
  nombre: string;

  @OneToMany(() => Medicamentos, medicamento => medicamento.tipo)
  medicamentos: Medicamentos[];

}