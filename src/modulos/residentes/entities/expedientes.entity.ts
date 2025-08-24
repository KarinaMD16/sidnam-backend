import { EstadoExpediente } from 'src/common/enums/estadosExpedientes.enum';
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Residente } from './residente.entity';
import { Patologias } from './patologias.entity';
import { Administraciones } from './administraciones.entity';
import { AdministracionesEspeciales } from './administracionEspecial.entity';
import { NotaEnfermeria } from './NotaEnfermeria.entity';

@Entity()
export class Expediente_Residente {
  @PrimaryGeneratedColumn()
  id_expediente: number;

  @Column()
  tipo_pension: string;

  @Column()
  fecha_ingreso: Date;

  @Column({
  type: 'enum',
  enum: EstadoExpediente,
  default: EstadoExpediente.Activo,
  })
  estado: EstadoExpediente;

  @Column({ nullable: true })
  fecha_cierre: Date;

  @OneToOne(() => Residente, residente => residente.expediente)
  @JoinColumn() 
  residente: Residente;

  @ManyToMany(() => Patologias, patologia => patologia.expedientes, { cascade: true })
  @JoinTable()
  patologias: Patologias[];

  @OneToMany(() => Administraciones, administracion => administracion.expediente)
  administraciones: Administraciones[];

  @OneToMany(() => AdministracionesEspeciales, administracionEspecial => administracionEspecial.expediente)
  administracionesEspeciales: AdministracionesEspeciales[];

  @OneToMany(() => NotaEnfermeria, nota => nota.expediente)
  notas: NotaEnfermeria[];

}