import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Administraciones } from './administraciones.entity';
import { Medicamentos } from './medicamento.entity';
import { Unidad_Medida } from '../../unidades-medida/entities/unidadMedida.entity';

@Entity()
export class AdministracionMedicamento {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Administraciones, admin => admin.administracionMedicamentos)
  administracion: Administraciones;

  @ManyToOne(() => Medicamentos, med => med.administracionMedicamentos)
  medicamento: Medicamentos;

  @Column('decimal', { precision: 10, scale: 2 })
  cantidad: number;

  @ManyToOne(() => Unidad_Medida, unidad => unidad.administracionMedicamentos)
  unidad: Unidad_Medida;
}
