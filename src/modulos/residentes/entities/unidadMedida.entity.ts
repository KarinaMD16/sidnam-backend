import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Administraciones } from './administraciones.entity';
import { AdministracionesEspeciales } from './administracionEspecial.entity';
import { tipo_unidad_medida } from 'src/common/enums/tipoUnidadMedida.enum';
import { AdministracionMedicamento } from './administracioneMedicamento';


@Entity()
export class Unidad_Medida {
  @PrimaryGeneratedColumn()
  id_unidad: number;

  @Column()
  nombre: string;

  @Column()
  abreviatura: string;

  @Column({type: 'enum', enum: tipo_unidad_medida})
  tipo: tipo_unidad_medida;

  @OneToMany(() => AdministracionMedicamento, am => am.unidad)
  administracionMedicamentos: AdministracionMedicamento[];

  @OneToMany(() => AdministracionesEspeciales, adminEsp => adminEsp.unidad)
  administracionesEspeciales: AdministracionesEspeciales[];


}