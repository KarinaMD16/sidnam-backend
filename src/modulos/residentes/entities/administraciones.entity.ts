import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Expediente_Residente } from './expedientes.entity';
import { Medicamentos } from './medicamento.entity';

@Entity()
export class Administraciones {
  @PrimaryGeneratedColumn()
  id_administracion: number;

  @Column()
  turno: string;

  @Column()
  dosis: string;

  @ManyToOne(() => Expediente_Residente, expediente => expediente.administraciones)
  expediente: Expediente_Residente;

  @ManyToMany(() => Medicamentos, medicamento => medicamento.administraciones, { cascade: true })
  @JoinTable() 
  medicamentos: Medicamentos[];

}