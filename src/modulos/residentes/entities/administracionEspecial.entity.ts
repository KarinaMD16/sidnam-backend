import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Expediente_Residente } from './expedientes.entity';
import { Medicamentos } from './medicamento.entity';

@Entity()
export class AdministracionesEspeciales {
  @PrimaryGeneratedColumn()
  id_administracion_especial: number;

  @Column()
  dosis: string;

  @Column()
  hora: string;

  @ManyToOne(() => Expediente_Residente, expediente => expediente.administracionesEspeciales)
  expediente: Expediente_Residente;

  @ManyToMany(() => Medicamentos, medicamento => medicamento.administracionesEspeciales, { cascade: true })
  @JoinTable()
  medicamentos: Medicamentos[];

}