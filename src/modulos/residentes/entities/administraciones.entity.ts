import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Expediente_Residente } from './expedientes.entity';
import { Medicamentos } from './medicamento.entity';
import { Turno } from 'src/common/enums/turno.enum';
import { Unidad_Medida } from './unidadMedida.entity';
import { AdministracionMedicamento } from './administracioneMedicamento';

@Entity()
export class Administraciones {
  @PrimaryGeneratedColumn()
  id_administracion: number;

  @Column({type: 'enum',enum: Turno,})
  turno: Turno;

  @ManyToOne(() => Expediente_Residente, expediente => expediente.administraciones)
  expediente: Expediente_Residente;

  @OneToMany(() => AdministracionMedicamento, am => am.administracion, { cascade: true })
  administracionMedicamentos: AdministracionMedicamento[];

}