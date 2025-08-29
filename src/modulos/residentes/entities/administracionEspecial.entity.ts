import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Expediente_Residente } from './expedientes.entity';
import { Medicamentos } from './medicamento.entity';
import { Unidad_Medida } from './unidadMedida.entity';

@Entity()
export class AdministracionesEspeciales {
  @PrimaryGeneratedColumn()
  id_administracion_especial: number;

  @Column()
  cantidad: number;

  @Column({ type: 'time' })
  hora: string; 

  @ManyToOne(() => Unidad_Medida, unidad => unidad.administraciones)
  unidad: Unidad_Medida;
  
  @ManyToOne(() => Expediente_Residente, expediente => expediente.administracionesEspeciales)
  expediente: Expediente_Residente;

  @ManyToOne(() => Medicamentos, medicamento => medicamento.administracionesEspeciales)
  medicamento: Medicamentos;

}