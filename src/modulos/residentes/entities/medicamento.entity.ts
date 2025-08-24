import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany } from 'typeorm';
import { Administraciones } from './administraciones.entity';
import { Tipo_medicamento } from './tipo_medicamento.entity';
import { AdministracionesEspeciales } from './administracionEspecial.entity';


@Entity()
export class Medicamentos {
  @PrimaryGeneratedColumn()
  id_medicamento: number;

  @Column()
  nombre: string;

  @ManyToMany(() => Administraciones, administracion => administracion.medicamentos)
  administraciones: Administraciones[];

  @ManyToOne(() => Tipo_medicamento, tipo => tipo.medicamentos)
  tipo: Tipo_medicamento;

  @ManyToMany(() => AdministracionesEspeciales, administracionEspecial => administracionEspecial.medicamentos)
  administracionesEspeciales: AdministracionesEspeciales[];
}