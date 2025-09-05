import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, OneToMany } from 'typeorm';
import { AdministracionesEspeciales } from './administracionEspecial.entity';
import { AdministracionMedicamento } from './administracioneMedicamento';
import { EntradaMedicamento } from 'src/modulos/inventarios/entities/entradaMedicamento.entity';


@Entity()
export class Medicamentos {
  @PrimaryGeneratedColumn()
  id_medicamento: number;

  @Column()
  nombre: string;

  @Column()
  tipo: string;

  @OneToMany(() => AdministracionMedicamento, am => am.medicamento, { cascade: true })
  administracionMedicamentos: AdministracionMedicamento[];

  @OneToMany(() => AdministracionesEspeciales, administracionEspecial => administracionEspecial.medicamento)
  administracionesEspeciales: AdministracionesEspeciales[];

  
  @OneToMany(() => EntradaMedicamento, entradasMedicamento => entradasMedicamento.medicamento)
  entradasMedicamento: EntradaMedicamento[];

}