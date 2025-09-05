import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Administraciones } from '../../residentes/entities/administraciones.entity';
import { AdministracionesEspeciales } from '../../residentes/entities/administracionEspecial.entity';
import { tipo_unidad_medida } from 'src/common/enums/tipoUnidadMedida.enum';
import { AdministracionMedicamento } from '../../residentes/entities/administracioneMedicamento';
import { Inventario } from 'src/modulos/inventarios/entities/inventario.entity';
import { EntradaMedicamento } from 'src/modulos/inventarios/entities/entradaMedicamento.entity';



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

  @OneToMany(() => Inventario, inventario => inventario.unidad_medida)
  inventarios: Inventario[];

  @OneToMany(() => EntradaMedicamento, entradaMed => entradaMed.unidad_medida)
  entradasMedicamento: EntradaMedicamento[];


}