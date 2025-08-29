import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Expediente_Residente } from './expedientes.entity';
import { Medicamentos } from './medicamento.entity';
import { Turno } from 'src/common/enums/turno.enum';
import { Unidad_Medida } from './unidadMedida.entity';

@Entity()
export class Administraciones {
  @PrimaryGeneratedColumn()
  id_administracion: number;

  @Column({type: 'enum',enum: Turno,})
  turno: Turno;

  @Column()
  cantidad: number;

  @ManyToOne(() => Unidad_Medida, unidad => unidad.administraciones)
  unidad: Unidad_Medida;

  @ManyToOne(() => Expediente_Residente, expediente => expediente.administraciones)
  expediente: Expediente_Residente;

  @ManyToOne(() => Medicamentos, medicamento => medicamento.administraciones)
  medicamento: Medicamentos;

}