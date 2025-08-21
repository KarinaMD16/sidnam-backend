import { EstadoExpediente } from 'src/common/enums/estadosExpedientes.enum';
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from 'typeorm';
import { Residente } from './residente.entity';

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
}