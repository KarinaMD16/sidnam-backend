import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, OneToMany } from 'typeorm';
import { Administraciones } from './administraciones.entity';
import { Tipo_medicamento } from './tipo_medicamento.entity';
import { AdministracionesEspeciales } from './administracionEspecial.entity';
import { AdministracionMedicamento } from './administracioneMedicamento';


@Entity()
export class Medicamentos {
  @PrimaryGeneratedColumn()
  id_medicamento: number;

  @Column()
  nombre: string;

  @OneToMany(() => AdministracionMedicamento, am => am.medicamento)
  administracionMedicamentos: AdministracionMedicamento[];

  @ManyToOne(() => Tipo_medicamento, tipo => tipo.medicamentos)
  tipo: Tipo_medicamento;

  @OneToMany(() => AdministracionesEspeciales, administracionEspecial => administracionEspecial.medicamento)
  administracionesEspeciales: AdministracionesEspeciales[];
}